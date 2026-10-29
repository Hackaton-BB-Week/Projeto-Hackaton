import { useCallback, useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { askRo, isAiConfigured, type ChatTurn } from '@/services/ai';
import { hasCrisisSignal } from './crisis';
import { localReply } from './localReplies';

// showHelp: mostra o aviso com os canais de ajuda acima do texto (só na 1ª resposta).
// offline: resposta automática (sem IA), mostrada com aviso de "sem conexão".
// failed: a IA não respondeu; a bolha mostra "Tentar de novo" e retryText guarda a pergunta.
export type ChatMessage = ChatTurn & {
  id: string;
  showHelp?: boolean;
  offline?: boolean;
  failed?: boolean;
  retryText?: string;
};

// idle: nada acontecendo | waiting: sem internet, esperando voltar | thinking: IA respondendo
export type ChatStatus = 'idle' | 'waiting' | 'thinking';

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content:
    'Oi, eu sou o Rô. Pode me contar o que você está sentindo hoje, estou aqui para ajudar em qualquer dificuldade. Aqui ninguém julga!',
};

// Quanto tempo esperar a internet voltar antes de usar a resposta automática.
const WAIT_FOR_NETWORK_MS = 20_000;

let nextId = 0;
const newId = () => `m${Date.now()}-${nextId++}`;

// null = ainda não sabemos; trata como online para não travar à toa.
const isOnline = (s: { isConnected: boolean | null; isInternetReachable?: boolean | null }) =>
  s.isConnected !== false && s.isInternetReachable !== false;

// Resolve true quando a internet volta, ou false se passar do tempo.
function waitForNetwork(timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      unsubscribe();
      resolve(false);
    }, timeoutMs);
    const unsubscribe = NetInfo.addEventListener((s) => {
      if (isOnline(s)) {
        clearTimeout(timer);
        unsubscribe();
        resolve(true);
      }
    });
  });
}

// Só entra no histórico enviado à IA o que foi conversa de verdade.
const toHistory = (msgs: ChatMessage[]): ChatTurn[] =>
  msgs.filter((m) => !m.failed && !m.offline).map(({ role, content }) => ({ role, content }));

// Estado do chat: mensagens, envio, conexão e se o cartão de crise deve aparecer.
// As conversas ficam só na memória do aparelho (nada é salvo no servidor).
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [online, setOnline] = useState(true);
  const [showCrisis, setShowCrisis] = useState(false);
  const busyRef = useRef(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => NetInfo.addEventListener((s) => setOnline(isOnline(s))), []);

  // Pede a resposta e coloca na tela. Usado no envio e no "Tentar de novo".
  const respond = useCallback(async (text: string, history: ChatTurn[]) => {
    busyRef.current = true;
    const isFirstReply = !history.some((m) => m.role === 'user');
    const add = (msg: Omit<ChatMessage, 'id' | 'role'>) =>
      setMessages((m) => [...m, { id: newId(), role: 'assistant', showHelp: isFirstReply, ...msg }]);

    try {
      if (!isAiConfigured()) {
        add({ content: localReply(text), offline: true });
        return;
      }

      // Sem internet: fica "aguardando conexão"; se não voltar, usa a resposta automática.
      if (!isOnline(await NetInfo.fetch())) {
        setStatus('waiting');
        if (!(await waitForNetwork(WAIT_FOR_NETWORK_MS))) {
          add({ content: localReply(text), offline: true });
          return;
        }
      }

      setStatus('thinking');
      try {
        add({ content: await askRo(text, history) });
      } catch {
        add({
          content: 'Não consegui falar com o Rô agora. Toque em "Tentar de novo".',
          failed: true,
          retryText: text,
          showHelp: false,
        });
      }
    } finally {
      busyRef.current = false;
      setStatus('idle');
    }
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busyRef.current) return;
      if (hasCrisisSignal(text)) setShowCrisis(true);

      const history = toHistory(messagesRef.current);
      setMessages((m) => [...m, { id: newId(), role: 'user', content: text }]);
      await respond(text, history);
    },
    [respond],
  );

  // Tira a bolha de erro e pede a resposta de novo para a mesma pergunta.
  const retry = useCallback(
    async (failedId: string) => {
      const failed = messagesRef.current.find((m) => m.id === failedId);
      if (!failed?.retryText || busyRef.current) return;
      const rest = messagesRef.current.filter((m) => m.id !== failedId);
      setMessages(rest);
      // Histórico = tudo antes da pergunta que falhou (ela é a última mensagem do usuário).
      const lastUser = rest.map((m) => m.role).lastIndexOf('user');
      await respond(failed.retryText, toHistory(rest.slice(0, lastUser)));
    },
    [respond],
  );

  const reset = useCallback(() => {
    setMessages([GREETING]);
    setShowCrisis(false);
  }, []);

  return {
    messages,
    status,
    sending: status !== 'idle',
    online,
    send,
    retry,
    reset,
    showCrisis,
    hideCrisis: () => setShowCrisis(false),
  };
}
