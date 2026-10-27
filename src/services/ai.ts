// Chama o chat de IA através da Edge Function (a chave da LLM fica no servidor).
const CHAT_URL = process.env.EXPO_PUBLIC_CHAT_FUNCTION_URL!;

export async function askRo(message: string, history: { role: string; content: string }[] = []) {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error('Falha ao falar com a IA');
  const data = (await res.json()) as { reply: string };
  return data.reply;
}
