import type { Trigger } from '@/store/useUserStore';
import type { AnswerKey, AnswerValue } from './questions';

// Regras puras do "ponto de partida" (mesmas do protótipo, computeObProfile).

export interface StartingPoint {
  weekly: number;
  monthly: number;
  yearly: number;
  trigger: Trigger;
  goal: number;
  /** Mensagem acolhedora. O trecho entre ** ** aparece em destaque. */
  message: string;
}

export const GOAL_TEXT: Record<number, string> = {
  0: 'guardar esse dinheiro',
  1: 'estar mais perto de quem você ama',
  2: 'cuidar da sua saúde',
  3: 'chegar mais perto do seu objetivo',
};

const num = (v: AnswerValue | undefined) => (typeof v === 'number' ? v : 0);

// Observações pelas respostas mais aprofundadas (no máximo duas, para não pesar).
const NOTES = {
  chase:
    'Você contou que costuma voltar para recuperar o que perdeu. Esse é o ciclo que mais aumenta o prejuízo, e aqui a gente trabalha junto para interrompê-lo.',
  borrow:
    'Pegar dinheiro emprestado para apostar pesa no bolso e na cabeça. O painel financeiro ajuda a enxergar e organizar isso.',
  time: 'Perder a noção do tempo apostando é mais comum do que parece. As missões do dia ajudam a ocupar esses momentos.',
  alone: 'Se ainda não há com quem conversar, a Rô está aqui a qualquer hora, sem julgamento.',
};

const SUPPORT_NOTE =
  'Se estiver difícil ter controle, você não precisa passar por isso sozinho(a): o CAPS (pelo SUS) e os Jogadores Anônimos oferecem apoio gratuito, e o CVV atende 24h pelo **188**.';

export function computeStartingPoint(
  answers: Partial<Record<AnswerKey, AnswerValue>>,
): StartingPoint {
  const weekly = num(answers.spend);
  const goal = num(answers.goal);
  const trigger = (typeof answers.trigger === 'string' ? answers.trigger : 'tedio') as Trigger;
  const freq = num(answers.freq);
  const time = num(answers.time);
  const more = num(answers.more);
  const chase = num(answers.chase);
  const borrow = num(answers.borrow);
  const impact = num(answers.impact);
  const tries = num(answers.tries);
  const support = num(answers.support);
  const goalText = GOAL_TEXT[goal] ?? GOAL_TEXT[0];

  // Sinais fortes: as respostas mais intensas de cada pergunta sobre o hábito.
  const strong = [impact >= 2, freq >= 3, more >= 2, chase >= 2, borrow >= 2, time >= 3].filter(
    Boolean,
  ).length;
  const some = freq >= 1 || tries >= 1 || more >= 1 || chase >= 1 || borrow >= 1 || impact >= 1;

  let message: string;
  if (strong >= 1) {
    message = `Pelo que você contou, as apostas vêm ocupando um espaço grande na sua rotina e no seu bolso. Isso não te define. É só um ponto de partida. A cada dia aqui, você vê esse valor virar progresso pra **${goalText}**.`;
  } else if (some) {
    message = `Você já percebe que quer ajustar essa relação, e isso é o passo mais importante. Vamos transformar o que ia pras apostas em algo real: um caminho pra **${goalText}**, um dia de cada vez.`;
  } else {
    message = `Que bom que você quer olhar pra isso com cuidado desde cedo. Aqui você acompanha, no seu ritmo, como o tempo e o dinheiro preservados podem te ajudar a **${goalText}**.`;
  }

  const notes: string[] = [];
  if (chase >= 2) notes.push(NOTES.chase);
  if (borrow >= 1) notes.push(NOTES.borrow);
  if (time >= 3) notes.push(NOTES.time);
  if (support >= 2) notes.push(NOTES.alone);
  const extra = notes.slice(0, 2);
  // Apoio profissional: vários sinais fortes, ou sinal forte sem ninguém por perto.
  if (strong >= 2 || (strong >= 1 && support >= 2)) extra.push(SUPPORT_NOTE);
  if (extra.length) message += '\n\n' + extra.join('\n\n');

  return { weekly, monthly: weekly * 4.3, yearly: weekly * 52, trigger, goal, message };
}
