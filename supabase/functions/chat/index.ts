// Edge Function: proxy do chat de IA (Rô). A chave da LLM fica como secret do
// Supabase, nunca no app.
//
// Fila de reserva: tenta os modelos na ordem abaixo. Se um bater no limite do
// plano grátis (429), não existir mais (404) ou der erro, passa na hora para o
// próximo. Se um demorar (Gemini sobrecarregado costuma travar ou dar 503 depois
// de vários segundos), dispara o próximo em paralelo e usa a primeira resposta.
// Todos usam o mesmo prompt, então a pessoa conversa sempre com a mesma Rô.
//   1. Gemini, chave principal (LLM_API_KEY)   -> todos os modelos de LLM_MODELS
//   2. Gemini, chaves reserva  (LLM_API_KEY_2 e _3) -> opcionais, outras contas Google
//   3. Groq                    (GROQ_API_KEY)  -> opcional, outro provedor
// Cada modelo tem a sua própria cota, então a fila soma os limites.
//
// Deploy:  supabase functions deploy chat --no-verify-jwt
// Secrets: supabase secrets set --env-file supabase/functions/.env
//
// Contrato: POST { message, history: [{ role: 'user'|'assistant', content }] } -> { reply }

import { SYSTEM_PROMPT } from './prompt.ts';

type Turn = { role: 'user' | 'assistant'; content: string };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Limites simples para não estourar a cota grátis.
const MAX_CHARS = 1500;
const MAX_TURNS = 12; // menos histórico = menos tokens por pergunta

const OFFLINE_REPLY =
  'Estou aqui pra te apoiar. (A IA ainda não foi configurada: defina LLM_API_KEY ou GROQ_API_KEY na Edge Function.)';
const ERROR_REPLY =
  'Tive um problema para responder agora. Se precisar conversar com alguém já, ligue 188 (CVV), 24h e gratuito.';

// Quando o filtro de segurança do Gemini bloqueia o pedido.
const BLOCKED_REPLY =
  'Isso eu não consigo responder. Eu tô aqui pra te ajudar com as apostas e o que vem junto com elas. Quer conversar sobre isso? Se estiver num momento difícil, o CVV atende no 188, 24h.';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let turns: Turn[];
  try {
    const { message, history = [] } = (await req.json()) as { message: string; history?: Turn[] };
    if (typeof message !== 'string' || !message.trim()) return json({ error: 'Mensagem vazia' }, 400);
    turns = [...history, { role: 'user' as const, content: message }]
      .filter((t) => (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string')
      .slice(-MAX_TURNS)
      .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_CHARS) }));
    // A conversa precisa começar com a pessoa (tira a saudação inicial do Rô).
    while (turns.length && turns[0].role !== 'user') turns.shift();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }

  const attempts = buildAttempts();
  if (!attempts.length) return json({ error: OFFLINE_REPLY }, 503);

  // O aviso com os canais de ajuda é mostrado pelo app (HELP_NOTICE em crisis.ts).
  const reply = await firstReply(attempts, turns);
  if (reply) return json({ reply });
  // Todos falharam: status de erro, e o app mostra "Tentar de novo".
  return json({ error: ERROR_REPLY }, 502);
});

// Tempo máximo de cada tentativa e da pergunta inteira (abaixo dos 45s do app).
const ATTEMPT_TIMEOUT_MS = 20_000;
const TOTAL_TIMEOUT_MS = 40_000;
// Sem resposta nesse tempo, começa a próxima tentativa em paralelo (no máximo
// MAX_PARALLEL ao mesmo tempo). Uma resposta normal leva 1–5s.
const HEDGE_MS = 5_000;
const MAX_PARALLEL = 3;

// Corre a fila e devolve a primeira resposta não vazia (ou null se todas falharem).
// Falha rápida (429, 404, 503) já chama a próxima; demora chama a próxima em paralelo.
function firstReply(attempts: Attempt[], turns: Turn[]): Promise<string | null> {
  return new Promise((resolve) => {
    const controllers: AbortController[] = [];
    let next = 0;
    let running = 0;
    let done = false;
    let hedgeTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = (reply: string | null) => {
      if (done) return;
      done = true;
      clearTimeout(totalTimer);
      clearTimeout(hedgeTimer);
      controllers.forEach((c) => c.abort()); // cancela as que ainda estão rodando
      resolve(reply);
    };
    const totalTimer = setTimeout(() => finish(null), TOTAL_TIMEOUT_MS);

    const launch = () => {
      clearTimeout(hedgeTimer);
      if (done) return;
      if (next >= attempts.length) {
        if (running === 0) finish(null);
        return;
      }
      const { name, run } = attempts[next++];
      const controller = new AbortController();
      controllers.push(controller);
      running++;
      run(turns, AbortSignal.any([controller.signal, AbortSignal.timeout(ATTEMPT_TIMEOUT_MS)]))
        .then((reply) => {
          if (!reply) throw new Error('resposta vazia');
          finish(reply);
        })
        .catch((err) => {
          if (!done) console.warn(`Falha em ${name}:`, String(err).slice(0, 300));
        })
        .finally(() => {
          running--;
          if (!done) launch();
        });
      hedgeTimer = setTimeout(() => {
        if (running < MAX_PARALLEL) launch();
      }, HEDGE_MS);
    };

    launch();
  });
}

class LlmError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type Attempt = { name: string; run: (turns: Turn[], signal: AbortSignal) => Promise<string> };

// Modelos do Gemini, em ordem. Os apelidos "-latest" ficam sobrecarregados com
// frequência e modelos antigos (2.0, 2.5) deixaram de existir para contas novas,
// então a fila mistura versões. Troque sem mexer no código com o secret
// LLM_MODELS (separados por vírgula); LLM_MODEL, se existir, entra em primeiro.
const DEFAULT_MODELS = [
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
];

function geminiModels(): string[] {
  const fromEnv = (Deno.env.get('LLM_MODELS') ?? '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  const first = Deno.env.get('LLM_MODEL')?.trim();
  const list = fromEnv.length ? fromEnv : DEFAULT_MODELS;
  return [...new Set(first ? [first, ...list] : list)];
}

// Monta a fila conforme as chaves configuradas (chaves vazias são ignoradas).
function buildAttempts(): Attempt[] {
  const list: Attempt[] = [];
  const models = geminiModels();
  const keys = ['LLM_API_KEY', 'LLM_API_KEY_2', 'LLM_API_KEY_3']
    .map((envName) => ({ envName, key: Deno.env.get(envName) }))
    .filter((k): k is { envName: string; key: string } => Boolean(k.key));
  const add = (k: { envName: string; key: string }, model: string) =>
    list.push({ name: `${k.envName}/${model}`, run: (t, s) => askGemini(k.key, model, t, s) });

  // Ordem: todos os modelos na 1ª chave -> todos nas chaves reserva.
  // Sobrecarga pega o modelo inteiro (em todas as contas), então vale trocar de
  // modelo antes de trocar de chave; limite (429) é por conta, e falha na hora.
  keys.forEach((k) => models.forEach((m) => add(k, m)));
  const groq = Deno.env.get('GROQ_API_KEY');
  if (groq) {
    // Confira os nomes em console.groq.com/docs/models; o segundo é menor e tem limites maiores.
    for (const model of [Deno.env.get('GROQ_MODEL') || 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant']) {
      list.push({ name: `groq/${model}`, run: (t, s) => askGroq(groq, model, t, s) });
    }
  }
  return list;
}

async function askGemini(apiKey: string, model: string, turns: Turn[], signal: AbortSignal): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        // O Gemini chama a IA de "model" em vez de "assistant".
        contents: turns.map((t) => ({
          role: t.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: t.content }],
        })),
        generationConfig: { maxOutputTokens: 2048, temperature: 0.6 },
        // Filtros de segurança do Google (já vêm ligados; aqui deixamos explícito).
        // Não use BLOCK_LOW: pode barrar quem está em crise.
        safetySettings: [
          'HARM_CATEGORY_HARASSMENT',
          'HARM_CATEGORY_HATE_SPEECH',
          'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          'HARM_CATEGORY_DANGEROUS_CONTENT',
        ].map((category) => ({ category, threshold: 'BLOCK_MEDIUM_AND_ABOVE' })),
      }),
    },
  );
  if (!res.ok) throw new LlmError(res.status, `Gemini ${model} ${res.status}: ${await res.text()}`);
  const data = await res.json();
  // Pedido ou resposta barrados pelo filtro: recusa gentil em vez de erro.
  const blocked =
    data.promptFeedback?.blockReason ||
    ['SAFETY', 'PROHIBITED_CONTENT'].includes(data.candidates?.[0]?.finishReason);
  if (blocked) return BLOCKED_REPLY;
  const parts: { text?: string }[] = data.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text ?? '').join('').trim();
}

async function askGroq(apiKey: string, model: string, turns: Turn[], signal: AbortSignal): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      temperature: 0.6,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...turns],
    }),
  });
  if (!res.ok) throw new LlmError(res.status, `Groq ${model} ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content ?? '').trim();
}
