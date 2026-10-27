// Edge Function: proxy do chat de IA. A chave da LLM fica como secret do Supabase,
// nunca no app. Ajuste o provedor/endpoint conforme a LLM escolhida.
//
// Deploy: supabase functions deploy chat
// Secret:  supabase secrets set LLM_API_KEY=...

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { message } = (await req.json()) as { message: string };
    const apiKey = Deno.env.get('LLM_API_KEY');

    if (!apiKey) {
      // Fallback de desenvolvimento, sem chamar provedor externo.
      return Response.json({
        reply:
          'Estou aqui pra te apoiar. (Configure LLM_API_KEY na Edge Function para respostas da IA real.)',
      });
    }

    // TODO: chamar o provedor de LLM aqui usando `apiKey` e `message`.
    // Mantenha um prompt de sistema acolhedor, que nunca substitui tratamento
    // e que direciona a ajuda (CVV 188) em sinais de crise.
    const reply = `Recebi: "${message}". Conecte o provedor de LLM nesta função.`;

    return Response.json({ reply });
  } catch {
    return new Response('Bad request', { status: 400 });
  }
});
