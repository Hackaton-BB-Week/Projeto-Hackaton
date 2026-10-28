// Detecção simples de sinais de crise. Roda no app, antes da IA, para que os
// canais de emergência apareçam mesmo se a IA falhar ou errar o tom.
// Melhor mostrar o cartão sem necessidade do que deixar de mostrar.

const CRISIS_PATTERNS = [
  /suic[ií]d/,
  /me matar/,
  /tirar (a )?minha (pr[oó]pria )?vida/,
  /quero morrer/,
  /n[aã]o (quero|aguento) mais viver/,
  /acabar com (a minha vida|tudo)/,
  /sumir (de vez|pra sempre|para sempre)/,
  /me (machucar|cortar|ferir)/,
  /n[aã]o vejo (sa[ií]da|motivo)/,
  /melhor sem mim/,
];

export function hasCrisisSignal(text: string): boolean {
  const t = text.toLowerCase();
  return CRISIS_PATTERNS.some((p) => p.test(t));
}

export const EMERGENCY_CHANNELS = [
  { label: 'Ligar para o CVV (188)', detail: '24h, gratuito, para conversar', phone: '188' },
  { label: 'Ligar para o SAMU (192)', detail: 'Emergência médica', phone: '192' },
] as const;

// Aviso fixo que abre a primeira resposta do Rô (com IA ou sem). Fica no app,
// não no prompt, para nunca ser esquecido e não gastar tokens.
export const HELP_NOTICE = [
  '📌 Em casos mais difíceis, procure sempre ajuda profissional:',
  '- CVV: ligue 188 (24h, gratuito)',
  '- CAPS: atendimento gratuito pelo SUS na sua cidade',
  '- Jogadores Anônimos: grupos de apoio',
  '- Autoexclusão das bets: gov.br/autoexclusaoapostas',
].join('\n');
