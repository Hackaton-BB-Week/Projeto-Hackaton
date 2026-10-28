import type { ComponentProps } from 'react';
import type { Feather } from '@expo/vector-icons';
import type { ButtonVariant } from '@/components/Button';
import type { Trigger } from '@/store/useUserStore';
import { GOAL_TEXT } from '@/features/onboarding/profile';
import { formatBRL } from '@/lib/format';

// Modo pré-jogo: perguntas (textos do protótipo) e o resultado personalizado.
// Regras puras e testáveis. Tom acolhedor, nunca de culpa.

type Icon = ComponentProps<typeof Feather>['name'];

export type PullId = 'tedio' | 'recuperar' | 'ansiedade' | 'partida' | 'promo';
export type ExpectId = 'dinheiro' | 'emocao' | 'alivio' | 'pertencer';
export type StrategyId = 'pausa' | 'sair' | 'missao' | 'falar' | 'atividade';
export type FeelingId = 'melhor' | 'medio' | 'dificil';

export type PreJogoAnswers = {
  pull: PullId;
  expect: ExpectId;
  strategy: StrategyId;
  feeling: FeelingId;
};

type Step<K extends keyof PreJogoAnswers> = {
  key: K;
  question: string;
  options: { id: PreJogoAnswers[K]; label: string }[];
};

export const STEPS = [
  {
    key: 'pull',
    question: 'O que está puxando você a apostar agora?',
    options: [
      { id: 'tedio', label: 'Tédio' },
      { id: 'recuperar', label: 'Tentar recuperar perdas' },
      { id: 'ansiedade', label: 'Ansiedade ou estresse' },
      { id: 'partida', label: 'Empolgação de uma partida' },
      { id: 'promo', label: 'Promoção / notificação' },
    ],
  } satisfies Step<'pull'>,
  {
    key: 'expect',
    question: 'O que você espera conseguir com essa aposta?',
    options: [
      { id: 'dinheiro', label: 'Dinheiro rápido' },
      { id: 'emocao', label: 'Emoção' },
      { id: 'alivio', label: 'Aliviar a tensão' },
      { id: 'pertencer', label: 'Fazer parte / pertencer' },
    ],
  } satisfies Step<'expect'>,
  {
    key: 'strategy',
    question: 'Escolha uma estratégia de proteção agora:',
    options: [
      { id: 'pausa', label: 'Fazer uma pausa de 15 minutos' },
      { id: 'sair', label: 'Sair do app de apostas' },
      { id: 'missao', label: 'Iniciar uma missão' },
      { id: 'falar', label: 'Falar com alguém de confiança' },
      { id: 'atividade', label: 'Escolher uma atividade alternativa' },
    ],
  } satisfies Step<'strategy'>,
  {
    key: 'feeling',
    question: 'Como você se sente depois de parar pra pensar?',
    options: [
      { id: 'melhor', label: 'Melhor, a vontade diminuiu' },
      { id: 'medio', label: 'Mais ou menos' },
      { id: 'dificil', label: 'Ainda está difícil' },
    ],
  } satisfies Step<'feeling'>,
] as const;

export const PRE_JOGO_REWARD = 15;

// ----- Textos do resultado -----

const PULL_TEXT: Record<PullId, string> = {
  tedio:
    'O tédio costuma passar em alguns minutos. Apostar para ocupar o tempo escala rápido: o tédio passa, a perda fica.',
  recuperar:
    'A vontade de recuperar o que foi perdido é o ciclo mais arriscado: apostar mais para cobrir uma perda costuma aumentar o prejuízo. Perceber isso agora já é um passo.',
  ansiedade:
    'Quando a ansiedade aperta, a aposta promete alívio rápido, mas costuma trazer mais tensão depois. Acalmar o corpo primeiro deixa a decisão mais clara.',
  partida:
    'A empolgação do jogo é real, e dá para curtir a partida sem apostar. Ter um plano para o horário do jogo faz muita diferença.',
  promo:
    'Promoções e notificações são feitas para puxar você de volta. Trate como gatilho, não como oportunidade. Desativar as notificações dos apps de aposta ajuda bastante.',
};

const EXPECT_TEXT: Record<ExpectId, string> = {
  dinheiro:
    'Dinheiro rápido é o que a aposta promete, mas ela é feita para a casa ganhar no longo prazo. O que você deixa de apostar é dinheiro que fica com você.',
  emocao:
    'Buscar emoção é humano. Dá para encontrar essa adrenalina em outras coisas: um esporte, um jogo sem dinheiro, assistir com amigos.',
  alivio:
    'Se o que você precisa é aliviar a tensão, existem caminhos que aliviam sem cobrar depois: respirar, caminhar, conversar.',
  pertencer:
    'Querer fazer parte do grupo é natural. Dá para participar da conversa e do jogo sem colocar dinheiro, e quem gosta de você vai entender.',
};

const PLAN_TEXT: Record<StrategyId, string> = {
  pausa:
    'Uma pausa de 15 minutos. A vontade costuma diminuir nesse tempo. Que tal começar pela respiração guiada?',
  sair: 'Sair do app de apostas. Feche agora e, se puder, deixe o celular um pouco de lado.',
  missao: 'Fazer uma missão. Ela ocupa a cabeça e ainda rende moedas para a sua vila.',
  falar:
    'Falar com alguém de confiança. Uma mensagem curta já basta: "Tô com vontade de apostar, pode conversar um pouco?"',
  atividade:
    'Uma atividade alternativa: algo que ocupe as mãos e a cabeça, como uma caminhada, um banho, cozinhar ou um jogo sem dinheiro.',
};

const FEELING_TEXT: Record<FeelingId, string> = {
  melhor: 'Você interrompeu o impulso. Siga para algo que te faça bem.',
  medio:
    'Tudo bem se a vontade ainda não passou de vez. Ela costuma diminuir com o tempo: siga o seu plano por mais alguns minutos.',
  dificil:
    'A vontade ainda está forte, e tudo bem pedir ajuda. Você não precisa passar por isso sozinho(a).',
};

// Mapeia o gatilho da pesquisa inicial para o do pré-jogo ("Amigos ou propaganda" → promo).
const SURVEY_TO_PULL: Record<Trigger, PullId> = {
  tedio: 'tedio',
  recuperar: 'recuperar',
  ansiedade: 'ansiedade',
  promo: 'promo',
};

// ----- Ações (para onde levar a pessoa) -----

export type ActionId = 'ajuda' | 'respirar' | 'chat' | 'missao' | 'financeiro';

export type ResultAction = {
  id: ActionId;
  label: string;
  icon: Icon;
  variant: ButtonVariant;
  href: '/ajuda' | '/ajuda?respirar=1' | '/chat' | '/missoes' | '/financeiro';
};

const ACTIONS: Record<ActionId, Omit<ResultAction, 'variant'>> = {
  ajuda: { id: 'ajuda', label: 'Ver canais de ajuda', icon: 'life-buoy', href: '/ajuda' },
  respirar: {
    id: 'respirar',
    label: 'Fazer a respiração guiada',
    icon: 'wind',
    href: '/ajuda?respirar=1',
  },
  chat: { id: 'chat', label: 'Conversar com a Rô', icon: 'message-circle', href: '/chat' },
  missao: { id: 'missao', label: 'Fazer uma missão', icon: 'target', href: '/missoes' },
  financeiro: {
    id: 'financeiro',
    label: 'Ver o painel financeiro',
    icon: 'bar-chart-2',
    href: '/financeiro',
  },
};

export type PreJogoContext = {
  /** Gatilho principal informado na pesquisa inicial, se houver. */
  surveyTrigger: Trigger | null;
  /** Objetivo da pesquisa inicial (0–3). */
  goal: number | null;
  weeklySpend: number;
};

export type PreJogoResult = {
  title: string;
  intro: string;
  /** true → mostrar o cartão de apoio imediato (CVV 188) no topo. */
  needsSupport: boolean;
  insights: string[];
  plan: string;
  goalReminder: string | null;
  actions: ResultAction[];
};

/** Ordem das ações: o que mais combina com as respostas vem primeiro. */
export function rankActions(a: PreJogoAnswers): ActionId[] {
  const order: ActionId[] = [];
  const add = (id: ActionId) => !order.includes(id) && order.push(id);

  if (a.feeling === 'dificil') {
    add('ajuda');
    add('chat');
  }
  if (a.strategy === 'pausa' || a.pull === 'ansiedade' || a.expect === 'alivio') add('respirar');
  if (a.strategy === 'missao' || a.strategy === 'atividade') add('missao');
  if (a.strategy === 'falar') add('chat');
  if (a.pull === 'recuperar' || a.expect === 'dinheiro') add('financeiro');
  add('chat');
  add('missao');
  // Até 4 botões, mas o caminho para a ajuda profissional nunca é cortado.
  if (order.slice(0, 4).includes('ajuda')) return order.slice(0, 4);
  return [...order.filter((id) => id !== 'ajuda').slice(0, 3), 'ajuda'];
}

export function buildResult(a: PreJogoAnswers, ctx: PreJogoContext): PreJogoResult {
  const insights = [PULL_TEXT[a.pull]];
  if (ctx.surveyTrigger && SURVEY_TO_PULL[ctx.surveyTrigger] === a.pull) {
    insights.push(
      'Esse é o mesmo gatilho que você apontou na pesquisa inicial. Reconhecer o padrão ajuda a se preparar antes da próxima vez.',
    );
  }
  let expect = EXPECT_TEXT[a.expect];
  if (a.expect === 'dinheiro' && ctx.weeklySpend > 0) {
    expect += ` Pelas suas respostas, isso é cerca de ${formatBRL(ctx.weeklySpend)} por semana que podem ficar com você.`;
  }
  insights.push(expect);

  const goalText = ctx.goal != null ? GOAL_TEXT[ctx.goal] : undefined;

  const actions = rankActions(a).map((id, i) => ({
    ...ACTIONS[id],
    variant: (id === 'ajuda' && a.feeling === 'dificil'
      ? 'soft'
      : i === 0
        ? 'primary'
        : 'outline') as ButtonVariant,
  }));

  return {
    title: 'Você pausou antes de agir',
    intro: FEELING_TEXT[a.feeling],
    needsSupport: a.feeling === 'dificil',
    insights,
    plan: PLAN_TEXT[a.strategy],
    goalReminder: goalText ? `Lembre do que você quer: ${goalText}.` : null,
    actions,
  };
}
