import type { Trigger } from '@/store/useUserStore';

// Perguntas da pesquisa inicial. Partem do protótipo (OBQ) e aprofundam temas que
// questionários de rastreio de apostas costumam olhar (apostar além do que pode,
// recuperar perdas, pegar emprestado, tempo gasto, rede de apoio). É uma conversa
// para conhecer a pessoa: nada aqui é avaliação clínica ou diagnóstico.
// Em cada pergunta numérica, 0 é a resposta mais tranquila.
// `spend`, `trigger` e `goal` vão para o perfil: não mude os valores deles.
export type AnswerKey =
  | 'freq'
  | 'time'
  | 'spend'
  | 'more'
  | 'chase'
  | 'borrow'
  | 'impact'
  | 'tries'
  | 'feel'
  | 'trigger'
  | 'support'
  | 'goal';
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
    key: 'time',
    title: 'Quando você aposta, quanto tempo costuma passar nisso?',
    options: [
      { label: 'Poucos minutos', value: 0 },
      { label: 'Até uma hora', value: 1 },
      { label: 'Algumas horas', value: 2 },
      { label: 'Às vezes perco a noção do tempo', value: 3 },
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
    key: 'more',
    title: 'Já apostou mais do que podia perder?',
    options: [
      { label: 'Nunca', value: 0 },
      { label: 'Às vezes', value: 1 },
      { label: 'Muitas vezes', value: 2 },
      { label: 'Quase sempre', value: 3 },
    ],
  },
  {
    key: 'chase',
    title: 'Depois de perder, você volta para tentar recuperar o dinheiro?',
    options: [
      { label: 'Nunca', value: 0 },
      { label: 'Às vezes', value: 1 },
      { label: 'Muitas vezes', value: 2 },
      { label: 'Quase sempre', value: 3 },
    ],
  },
  {
    key: 'borrow',
    title: 'Já pegou dinheiro emprestado ou vendeu algo para apostar ou cobrir perdas?',
    options: [
      { label: 'Nunca', value: 0 },
      { label: 'Uma vez', value: 1 },
      { label: 'Algumas vezes', value: 2 },
      { label: 'Com frequência', value: 3 },
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
      { label: 'Empolgação de uma partida', value: 'partida' },
      { label: 'Amigos ou propaganda', value: 'promo' },
    ],
  },
  {
    key: 'support',
    title: 'Você tem com quem conversar sobre isso?',
    options: [
      { label: 'Sim, alguém de confiança', value: 0 },
      { label: 'Talvez, mas ainda não falei', value: 1 },
      { label: 'Prefiro não falar com ninguém agora', value: 2 },
      { label: 'Não tenho com quem contar', value: 3 },
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
