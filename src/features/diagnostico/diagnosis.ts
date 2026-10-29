import type { Href } from 'expo-router';
import type { Trigger } from '@/store/useUserStore';
import { formatBRL } from '@/lib/format';

// "Refazer diagnóstico": perguntas (textos do protótipo) e o resultado. Regras puras.
// É uma referência para reflexão, nunca um diagnóstico clínico.

export type DiagKey = 'freq' | 'spend' | 'rec' | 'parar' | 'ext' | 'gat';
export type DiagAnswers = {
  freq: number;
  spend: number;
  rec: number;
  parar: number;
  ext: number;
  gat: Trigger;
};

export type DiagQuestion = {
  key: DiagKey;
  question: string;
  options: { id: string; label: string; value: number | Trigger }[];
};

const opts = (pairs: [string, number | Trigger][]) =>
  pairs.map(([label, value]) => ({ id: String(value), label, value }));

export const QUESTIONS: DiagQuestion[] = [
  {
    key: 'freq',
    question: 'Com que frequência você aposta?',
    options: opts([
      ['Raramente', 0],
      ['Algumas vezes no mês', 1],
      ['Quase toda semana', 2],
      ['Quase todo dia', 3],
    ]),
  },
  {
    key: 'spend',
    question: 'Quanto costuma gastar por semana?',
    options: opts([
      ['Até R$ 20', 15],
      ['R$ 20 a 50', 35],
      ['R$ 50 a 150', 100],
      ['R$ 150 a 400', 275],
      ['Mais de R$ 400', 500],
    ]),
  },
  {
    key: 'rec',
    question: 'Você aposta pra tentar recuperar o que perdeu?',
    options: opts([
      ['Nunca', 0],
      ['Às vezes', 1],
      ['Quase sempre', 2],
    ]),
  },
  {
    key: 'parar',
    question: 'Depois que começa, é difícil parar?',
    options: opts([
      ['Não', 0],
      ['Às vezes', 1],
      ['Muito', 2],
    ]),
  },
  {
    key: 'ext',
    question: 'Odds, promoções ou notificações te puxam a apostar?',
    options: opts([
      ['Não', 0],
      ['Às vezes', 1],
      ['Muito', 2],
    ]),
  },
  {
    key: 'gat',
    question: 'O que mais dispara sua vontade?',
    options: opts([
      ['Tédio', 'tedio'],
      ['Ansiedade/estresse', 'ansiedade'],
      ['Empolgação da partida', 'partida'],
      ['Recuperar perdas', 'recuperar'],
      ['Promoções', 'promo'],
    ]),
  },
];

export const TRIGGER_NAME: Record<Trigger, string> = {
  tedio: 'o tédio',
  ansiedade: 'a ansiedade ou o estresse',
  partida: 'a empolgação das partidas',
  recuperar: 'tentar recuperar perdas',
  promo: 'as promoções e notificações',
};

// Recomendações do protótipo, por gatilho.
const TRIGGER_RECS: Record<Trigger, string[]> = {
  tedio: [
    'Tenha uma lista de atividades prontas para os momentos livres.',
    'Use o Modo pré-jogo quando bater o tédio.',
  ],
  ansiedade: [
    'Experimente a respiração guiada na aba Ajuda.',
    'Registre no Modo pré-jogo o que sente antes de apostar.',
  ],
  partida: [
    'Planeje como atravessar o horário dos jogos.',
    'Assista com alguém, com um combinado de não apostar.',
  ],
  recuperar: [
    'Lembre: "recuperar" leva a apostar mais e perder mais.',
    'Ao sentir essa vontade, abra o Modo pré-jogo antes de agir.',
  ],
  promo: [
    'Desative notificações das casas de apostas.',
    'Trate promoção como gatilho, não como oportunidade.',
  ],
};

// Recomendações extras pelos outros sinais (só quando não repetem o gatilho principal).
const SIGNAL_RECS = {
  rec: (level: number) =>
    `Você contou que ${level >= 2 ? 'quase sempre' : 'às vezes'} aposta para recuperar perdas: esse é o ciclo que mais aumenta o prejuízo. O painel financeiro ajuda a ver para onde esse dinheiro pode ir.`,
  parar:
    'Quando é difícil parar depois de começar, a melhor proteção é agir antes: abra o Modo pré-jogo assim que a vontade aparecer.',
  ext: 'Odds, promoções e notificações puxam você: silenciar os apps e e-mails de apostas diminui os convites.',
};

export type DiagAction = { label: string; icon: string; href: Href };

const TRIGGER_ACTION: Record<Trigger, DiagAction> = {
  tedio: { label: 'Ver as missões do dia', icon: 'target', href: '/missoes' },
  ansiedade: { label: 'Fazer a respiração guiada', icon: 'wind', href: '/ajuda?respirar=1' },
  partida: { label: 'Ver as missões do dia', icon: 'target', href: '/missoes' },
  recuperar: { label: 'Abrir o painel financeiro', icon: 'credit-card', href: '/financeiro' },
  promo: { label: 'Abrir o Modo pré-jogo', icon: 'shield', href: '/pre-jogo' },
};

export type Diagnosis = {
  trigger: Trigger;
  triggerName: string;
  /** true se o gatilho mudou em relação ao que estava salvo. */
  triggerChanged: boolean;
  recommendations: string[];
  weeklySpend: number;
  /** Frase sobre a estimativa semanal (nova ou alterada). */
  spendNote: string;
  /** Sinais fortes → sugerir apoio profissional gratuito, com cuidado. */
  suggestSupport: boolean;
  action: DiagAction;
};

export type Previous = { weeklySpend: number; trigger: Trigger | null };

export function buildDiagnosis(a: DiagAnswers, prev: Previous): Diagnosis {
  const trigger = a.gat;
  const recommendations = [...TRIGGER_RECS[trigger]];
  if (a.rec >= 1 && trigger !== 'recuperar') recommendations.push(SIGNAL_RECS.rec(a.rec));
  if (a.parar >= 1) recommendations.push(SIGNAL_RECS.parar);
  if (a.ext >= 1 && trigger !== 'promo') recommendations.push(SIGNAL_RECS.ext);

  const weeklySpend = a.spend;
  let spendNote: string;
  if (prev.weeklySpend > 0 && prev.weeklySpend !== weeklySpend) {
    const lower = weeklySpend < prev.weeklySpend;
    spendNote = `Sua estimativa semanal foi de ${formatBRL(prev.weeklySpend)} para ${formatBRL(weeklySpend)}.${lower ? ' Que bom ver esse valor diminuir.' : ''}`;
  } else {
    spendNote = `Estimativa semanal: ${formatBRL(weeklySpend)}.`;
  }

  return {
    trigger,
    triggerName: TRIGGER_NAME[trigger],
    triggerChanged: prev.trigger !== null && prev.trigger !== trigger,
    recommendations,
    weeklySpend,
    spendNote,
    suggestSupport: a.freq >= 3 || a.parar >= 2 || a.rec >= 2,
    action: TRIGGER_ACTION[trigger],
  };
}
