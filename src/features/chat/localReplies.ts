// Respostas pré-definidas (o MVP do docs/MVP.md). Usadas quando a IA não está
// configurada ou não responde, para o chat nunca ficar mudo na demonstração.
// Junta um parágrafo para CADA assunto encontrado na mensagem, na mesma
// estrutura do prompt da IA: acolhimento -> um parágrafo por assunto -> vídeo -> pergunta.

type Rule = { match: RegExp; reply: string; video?: string };

const VIDEOS = {
  consciencia:
    '🎥 Vale assistir: "Você NUNCA MAIS vai querer APOSTAR depois de ouvir MINHA HISTÓRIA - Henrique Fratta" https://youtu.be/A2xARmqTVfI',
  investir:
    '🎥 Vale assistir: "COMO INVESTIR EM CDB (AULA COMPLETA PARA INICIANTES)" https://youtu.be/pk6b-sO-sdM',
  vicio:
    '🎥 Vale assistir: "Você Sofre de Vício em Jogos? Veja os Sintomas e Tratamentos" https://youtu.be/fuDjyXJhuCg',
};

const CRISIS: Rule = {
  match: /suic|morrer|me matar|sumir|machucar|n[aã]o aguento/,
  reply:
    'Sinto muito que você esteja passando por isso. Você importa, e não precisa atravessar isso sozinho. Ligue agora para o CVV no 188 (24h, gratuito) ou, se estiver em risco, para o SAMU no 192. Se puder, chame alguém de confiança para ficar com você. Eu continuo aqui.',
};

// A ordem aqui é a ordem dos parágrafos na resposta.
const RULES: Rule[] = [
  {
    match: /vontade|apostar|aposta|jogar|jogo|bet|tentad|reca[ií]|v[ií]cio|viciad|cabe[cç]a/,
    reply:
      'Sobre a vontade de apostar: ela costuma subir como uma onda e passar em 10 a 20 minutos. Quando vier, tente não decidir nada por 10 minutos: respira fundo, levanta, bebe uma água ou manda mensagem pra alguém de confiança. Também ajuda perceber o que puxa essa vontade (horário, dia do pagamento, tédio, propaganda) e bloquear o acesso, por exemplo pela autoexclusão em gov.br/autoexclusaoapostas.',
    video: VIDEOS.vicio,
  },
  {
    match: /fam[ií]lia|esposa|marido|m[aã]e|pai|filh|parceir|namor|confian|brig/,
    reply:
      'Sobre a sua família: brigas assim doem, e querer resolver já é um passo grande. Ajuda preparar uma conversa honesta: contar que você está buscando mudar, assumir o que aconteceu sem se humilhar e ouvir sem se defender. Proponha algo concreto, como mostrar seus gastos por um tempo. A confiança volta aos poucos, com atitudes no dia a dia.',
  },
  {
    match: /d[ií]vida|devendo|empr[eé]stimo|cart[aã]o|conta/,
    reply:
      'Sobre as dívidas: liste o que você deve, para quem e os juros de cada uma. Garanta primeiro o básico (moradia, comida, contas essenciais), depois foque nas dívidas com juros mais altos e tente renegociar.',
  },
  {
    match: /invest|guardar|poupar|poupan|reserva|recuperar|dinheiro|sal[aá]rio|cdb|cdi|tesouro/,
    reply:
      'Sobre recuperar o dinheiro: apostar de novo nunca recupera o que foi perdido, só aumenta a perda. O caminho que funciona é mais lento, mas seguro: guardar um pouco todo mês numa reserva de emergência, em algo de renda fixa como Tesouro Selic ou um CDB com liquidez diária perto de 100% do CDI. Numa simulação, guardando R$ 100 por mês a 13% ao ano, em 1 ano você teria cerca de R$ 1.270 (guardou R$ 1.200), e em 5 anos cerca de R$ 8.229 (guardou R$ 6.000). É só um exemplo: a taxa muda e tem imposto de renda.',
    video: VIDEOS.investir,
  },
];

const OPENING = 'Obrigado por confiar em mim pra falar disso, é comum passar por isso e você não está sozinho.';
const CLOSING = 'Você já deu um passo importante ao buscar ajuda. Precisa de ajuda com mais alguma coisa?';

const DEFAULT_REPLY = `Estou aqui pra te ouvir, sem julgamento. Me conta um pouco mais do que está acontecendo: é a vontade de apostar, dinheiro, família, ou outra coisa?\n\n${VIDEOS.consciencia}`;

export function localReply(message: string): string {
  const t = message.toLowerCase();
  if (CRISIS.match.test(t)) return CRISIS.reply;

  const found = RULES.filter((r) => r.match.test(t));
  if (!found.length) return DEFAULT_REPLY;

  // Um vídeo só: o do primeiro assunto que tiver vídeo.
  const video = found.find((r) => r.video)?.video;
  return [OPENING, ...found.map((r) => r.reply), video, CLOSING].filter(Boolean).join('\n\n');
}
