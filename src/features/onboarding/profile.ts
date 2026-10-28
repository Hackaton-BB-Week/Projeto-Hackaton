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

export function computeStartingPoint(
  answers: Partial<Record<AnswerKey, AnswerValue>>,
): StartingPoint {
  const weekly = num(answers.spend);
  const goal = num(answers.goal);
  const trigger = (typeof answers.trigger === 'string' ? answers.trigger : 'tedio') as Trigger;
  const impact = num(answers.impact);
  const freq = num(answers.freq);
  const tries = num(answers.tries);
  const goalText = GOAL_TEXT[goal] ?? GOAL_TEXT[0];

  let message: string;
  if (impact >= 2 || freq >= 3) {
    message = `Pelo que você contou, as apostas vêm ocupando um espaço grande na sua rotina e no seu bolso. Isso não te define — é só um ponto de partida. A cada dia aqui, você vê esse valor virar progresso pra **${goalText}**.`;
  } else if (freq >= 1 || tries >= 1) {
    message = `Você já percebe que quer ajustar essa relação, e isso é o passo mais importante. Vamos transformar o que ia pras apostas em algo real: um caminho pra **${goalText}**, um dia de cada vez.`;
  } else {
    message = `Que bom que você quer olhar pra isso com cuidado desde cedo. Aqui você acompanha, no seu ritmo, como o tempo e o dinheiro preservados podem te ajudar a **${goalText}**.`;
  }

  return { weekly, monthly: weekly * 4.3, yearly: weekly * 52, trigger, goal, message };
}
