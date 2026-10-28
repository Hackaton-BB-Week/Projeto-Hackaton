import { create } from 'zustand';
import type { AnswerKey, AnswerValue } from './questions';

// Respostas em andamento da pesquisa (só na memória; o resultado final vai pro useUserStore).
interface SurveyState {
  index: number;
  answers: Partial<Record<AnswerKey, AnswerValue>>;
  answer: (key: AnswerKey, value: AnswerValue) => void;
  setIndex: (i: number) => void;
  reset: () => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  index: 0,
  answers: {},
  answer: (key, value) => set((s) => ({ answers: { ...s.answers, [key]: value } })),
  setIndex: (index) => set({ index }),
  reset: () => set({ index: 0, answers: {} }),
}));
