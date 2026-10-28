import Constants from 'expo-constants';

// Chama o chat de IA através da Edge Function (a chave da LLM fica no servidor).
const CHAT_URL = resolveChatUrl(process.env.EXPO_PUBLIC_CHAT_FUNCTION_URL);

// Em desenvolvimento, "localhost" no celular é o próprio celular, não o PC.
// Troca pelo endereço do PC que o Expo já usa (IP do Wi-Fi, ou localhost pelo cabo USB).
function resolveChatUrl(url?: string) {
  if (!url || !__DEV__ || !/\/\/(localhost|127\.0\.0\.1)[:/]/.test(url)) return url;
  const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
  return devHost ? url.replace(/\/\/(localhost|127\.0\.0\.1)/, `//${devHost}`) : url;
}
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export const isAiConfigured = () => Boolean(CHAT_URL);

export async function askRo(message: string, history: ChatTurn[] = []): Promise<string> {
  if (!CHAT_URL) throw new Error('EXPO_PUBLIC_CHAT_FUNCTION_URL não configurada');

  // Sem resposta em 45s, desiste (o servidor pode tentar mais de um modelo).
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // A chave pública do Supabase é aceita pelo gateway; a da LLM nunca sai do servidor.
        ...(ANON_KEY ? { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } : {}),
      },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? `Falha ao falar com a IA (${res.status})`);
    if (!data.reply) throw new Error('Resposta vazia da IA');
    return data.reply;
  } finally {
    clearTimeout(timer);
  }
}
