import type { ComponentProps } from 'react';
import type { Feather } from '@expo/vector-icons';

// Missões diárias (textos do protótipo). Regras puras e testáveis.
// Sem sorte: as missões do dia saem de uma rotação fixa pela data, iguais para
// todo mundo, e a recompensa é sempre a mesma (exigência do edital).

export type Mission = {
  id: string;
  icon: ComponentProps<typeof Feather>['name'];
  title: string;
  description: string;
  reward: number;
};

export const MISSION_REWARD = 12;
export const MISSIONS_PER_DAY = 3;

export const MISSIONS: Mission[] = [
  {
    id: 'rodada',
    icon: 'tv',
    title: 'A rodada começou',
    description: 'Planeje como atravessar o horário de uma partida sem apostar.',
    reward: MISSION_REWARD,
  },
  {
    id: 'recuperar',
    icon: 'repeat',
    title: 'Recuperar não é estratégia',
    description: 'Reconheça a vontade de recuperar perdas com novas apostas.',
    reward: MISSION_REWARD,
  },
  {
    id: 'intervalo',
    icon: 'pause',
    title: 'Intervalo consciente',
    description: 'Faça uma pausa antes de qualquer decisão por impulso.',
    reward: MISSION_REWARD,
  },
  {
    id: 'escalado',
    icon: 'dollar-sign',
    title: 'Dinheiro escalado',
    description: 'Escolha um destino melhor para um valor que você teria apostado.',
    reward: MISSION_REWARD,
  },
  {
    id: 'virada',
    icon: 'target',
    title: 'Virada de verdade',
    description: 'Substitua a vontade de apostar por uma atividade que te faça bem.',
    reward: MISSION_REWARD,
  },
  {
    id: 'vinculo',
    icon: 'users',
    title: 'Rede de apoio',
    description: 'Mande mensagem para alguém de confiança.',
    reward: MISSION_REWARD,
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

/** Dia do calendário local, ex.: "2026-10-28". Vira à meia-noite no horário do aparelho. */
export function dayKey(date: Date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Número sequencial do dia local (dias desde 1970-01-01). */
export function dayNumber(date: Date = new Date()) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

/** As missões de um dia: janela de 3 que anda uma posição por dia no catálogo. */
export function missionsForDay(day: number): Mission[] {
  const n = MISSIONS.length;
  const start = ((day % n) + n) % n;
  return Array.from({ length: MISSIONS_PER_DAY }, (_, i) => MISSIONS[(start + i) % n]);
}
