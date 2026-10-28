// Edge Function: proxy do chat de IA (Rô). A chave da LLM fica como secret do
// Supabase, nunca no app.
//
// Fila de reserva: tenta os modelos na ordem abaixo. Se um bater no limite do
// plano grátis (429) ou estiver fora do ar, passa na hora para o próximo.
// Todos usam o mesmo prompt, então a pessoa conversa sempre com a mesma Rô.
//   1. Gemini, chave principal (LLM_API_KEY)   -> modelo principal e o "lite"
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

  // Cada tentativa tem tempo máximo: se o Gemini travar (comum quando está
  // sobrecarregado), desiste e passa para a próxima chave/modelo da fila.
  // O total fica abaixo dos 45s que o app espera.
  const deadline = Date.now() + 40_000;
  for (const { name, run } of attempts) {
    const remaining = deadline - Date.now();
    if (remaining < 3_000) break;
    try {
      const reply = await run(turns, AbortSignal.timeout(Math.min(ATTEMPT_TIMEOUT_MS, remaining)));
      // O aviso com os canais de ajuda é mostrado pelo app (HELP_NOTICE em crisis.ts).
      if (reply) return json({ reply });
    } catch (err) {
      console.warn(`Falha em ${name}:`, String(err).slice(0, 300));
    }
  }
  // Todos falharam: status de erro, e o app mostra "Tentar de novo".
  return json({ error: ERROR_REPLY }, 502);
});

class LlmError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type Attempt = { name: string; run: (turns: Turn[], signal: AbortSignal) => Promise<string> };

// Tempo máximo de cada tentativa antes de passar para a próxima da fila.
const ATTEMPT_TIMEOUT_MS = 15_000;

// Monta a fila conforme as chaves configuradas (chaves vazias são ignoradas).
function buildAttempts(): Attempt[] {
  const list: Attempt[] = [];
  const main = Deno.env.get('LLM_MODEL') || 'gemini-flash-latest';
  const lite = 'gemini-flash-lite-latest';
  const keys = ['LLM_API_KEY', 'LLM_API_KEY_2', 'LLM_API_KEY_3']
    .map((envName) => ({ envName, key: Deno.env.get(envName) }))
    .filter((k): k is { envName: string; key: string } => Boolean(k.key));
  const add = (k: { envName: string; key: string }, model: string) =>
    list.push({ name: `${k.envName}/${model}`, run: (t, s) => askGemini(k.key, model, t, s) });

  // Ordem: principal na 1ª chave -> lite em todas as chaves -> principal nas outras.
  // Quando o Gemini está sobrecarregado, é o modelo inteiro (em todas as contas),
  // então vale pular logo para o lite em vez de insistir no modelo lotado.
  if (keys[0]) add(keys[0], main);
  keys.forEach((k) => add(k, lite));
  keys.slice(1).forEach((k) => add(k, main));
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
