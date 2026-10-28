import type { Trigger } from '@/store/useUserStore';

// Perguntas da pesquisa inicial (textos do protótipo, OBQ).
export type AnswerKey = 'freq' | 'spend' | 'impact' | 'tries' | 'feel' | 'trigger' | 'goal';
export type AnswerValue = number | Trigger;

export interface Question {
  key: AnswerKey;
  title: string;
  options: { label: string; value: AnswerValue }[];
}

export const QUESTIONS: Question[] = [
  {
    key: 'freq',
    title: 'Com que frequência você costuma apostar?',
    options: [
      { label: 'Raramente', value: 0 },
      { label: 'Algumas vezes no mês', value: 1 },
      { label: 'Quase toda semana', value: 2 },
      { label: 'Quase todo dia', value: 3 },
    ],
  },
  {
    key: 'spend',
    title: 'Quanto costuma gastar por semana em apostas?',
    options: [
      { label: 'Até R$ 20', value: 15 },
      { label: 'R$ 20 a R$ 50', value: 35 },
      { label: 'R$ 50 a R$ 150', value: 100 },
      { label: 'R$ 150 a R$ 400', value: 275 },
      { label: 'Mais de R$ 400', value: 500 },
    ],
  },
  {
    key: 'impact',
    title: 'Apostar já afetou suas contas ou compromissos?',
    options: [
      { label: 'Nunca', value: 0 },
      { label: 'Algumas vezes', value: 1 },
      { label: 'Com frequência', value: 2 },
    ],
  },
  {
    key: 'tries',
    title: 'Já tentou parar ou diminuir e teve dificuldade?',
    options: [
      { label: 'Não tentei ainda', value: 0 },
      { label: 'Tentei uma vez', value: 1 },
      { label: 'Tentei várias vezes', value: 2 },
    ],
  },
  {
    key: 'feel',
    title: 'Como costuma se sentir depois de apostar?',
    options: [
      { label: 'Tranquilo(a)', value: 0 },
      { label: 'Indiferente', value: 1 },
      { label: 'Arrependido(a)', value: 2 },
      { label: 'Ansioso(a)', value: 3 },
    ],
  },
  {
    key: 'trigger',
    title: 'O que mais aumenta sua vontade de apostar?',
    options: [
      { label: 'Tédio', value: 'tedio' },
      { label: 'Tentar recuperar perdas', value: 'recuperar' },
      { label: 'Ansiedade ou estresse', value: 'ansiedade' },
      { label: 'Amigos ou propaganda', value: 'promo' },
    ],
  },
  {
    key: 'goal',
    title: 'O que você gostaria de fazer com esse tempo e dinheiro?',
    options: [
      { label: 'Guardar dinheiro', value: 0 },
      { label: 'Estar com quem amo', value: 1 },
      { label: 'Cuidar da saúde', value: 2 },
      { label: 'Realizar um objetivo', value: 3 },
    ],
  },
];
