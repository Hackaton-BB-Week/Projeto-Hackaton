// "Aposta ou Escolha?": cenários educativos. Nenhuma aposta acontece aqui — a pessoa
// escolhe como reagiria e vê os riscos ou benefícios. Os 3 primeiros vêm do protótipo.
// Só conceitos gerais e verdadeiros; não invente números ou estatísticas.

export type ScenarioOption = {
  text: string;
  /** true = escolha que protege. */
  protective: boolean;
  feedback: string;
};

export type Scenario = {
  id: string;
  situation: string;
  options: ScenarioOption[];
  /** O mecanismo por trás da situação (o lado educativo). */
  learn: { title: string; text: string };
};

export const ESCOLHA_REWARD = 10;

export const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    situation:
      'Você perdeu dinheiro ontem e hoje apareceu uma promoção "imperdível". O que você faz?',
    options: [
      {
        text: 'Aposto pra tentar recuperar',
        protective: false,
        feedback:
          'A vontade de recuperar perdas é o ciclo mais perigoso: leva a apostar mais e perder mais. Promoções existem pra te manter apostando.',
      },
      {
        text: 'Faço uma pausa e uso o Modo pré-jogo',
        protective: true,
        feedback: 'Ótima escolha. Pausar quebra o impulso.',
      },
      {
        text: 'Fecho o app e faço outra coisa',
        protective: true,
        feedback: 'Perfeito. Sair do ambiente de aposta reduz muito o risco.',
      },
    ],
    learn: {
      title: 'Correr atrás do prejuízo',
      text: 'Tentar recuperar uma perda apostando de novo costuma aumentar o valor perdido. E bônus e promoções geralmente vêm com regras, como ter que apostar o valor várias vezes antes de poder sacar, que mantêm você jogando por mais tempo.',
    },
  },
  {
    id: 's2',
    situation: 'Seu time joga hoje e assistir te dá vontade de apostar. Como se protege?',
    options: [
      {
        text: 'Assisto e aposto "só dessa vez"',
        protective: false,
        feedback:
          '"Só dessa vez" costuma virar hábito. Se assistir é gatilho, tenha um plano antes do jogo.',
      },
      {
        text: 'Assisto com um amigo, sem apostar',
        protective: true,
        feedback: 'Boa! Companhia e um combinado prévio ajudam.',
      },
      {
        text: 'Faço a missão "A rodada começou"',
        protective: true,
        feedback:
          'Exato — planejar o horário da partida é das estratégias mais eficazes.',
      },
    ],
    learn: {
      title: 'Gatilhos têm hora marcada',
      text: 'Jogos, notificações e propagandas costumam aparecer nos mesmos horários. Saber quando a vontade vem permite se preparar antes: combinar com alguém, mudar de ambiente ou ter outra atividade pronta.',
    },
  },
  {
    id: 's3',
    situation: 'Bateu tédio numa noite livre e a mão foi pro app de apostas. E agora?',
    options: [
      {
        text: 'Aposto pra passar o tempo',
        protective: false,
        feedback: 'Apostar por tédio escala rápido. O tédio passa; a perda fica.',
      },
      {
        text: 'Escolho uma atividade alternativa',
        protective: true,
        feedback:
          'Isso! Ter alternativas prontas para os momentos de risco faz diferença.',
      },
    ],
    learn: {
      title: 'A aposta vende emoção',
      text: 'Os apps de aposta são feitos para serem rápidos e estimulantes, o que os torna tentadores nos momentos de tédio. Ter uma lista de coisas que você gosta de fazer ajuda a responder à vontade sem colocar dinheiro em jogo.',
    },
  },
  {
    id: 's4',
    situation:
      'Você ganhou uma aposta semana passada e sente que "está com sorte". O que faz com isso?',
    options: [
      {
        text: 'Aposto mais enquanto a maré está boa',
        protective: false,
        feedback:
          'Ganhar de vez em quando faz parte do que prende: a recompensa imprevisível é justamente o que torna difícil parar. No conjunto das apostas, a casa sai na frente.',
      },
      {
        text: 'Guardo o dinheiro e não volto a apostar',
        protective: true,
        feedback: 'Boa escolha. O que fica com você é o único ganho garantido.',
      },
      {
        text: 'Uso pra pagar uma conta ou começar uma reserva',
        protective: true,
        feedback: 'Ótimo. Dar um destino ao dinheiro tira ele do alcance da próxima aposta.',
      },
    ],
    learn: {
      title: 'A casa sempre leva uma parte',
      text: 'As cotações (odds) são calculadas com uma margem a favor da casa. Por isso, somando todas as apostas, quem aposta perde mais do que ganha. Uma vitória não muda essa conta: ela só é a parte que aparece.',
    },
  },
  {
    id: 's5',
    situation: 'Você perdeu várias vezes seguidas e pensa: "agora tem que vir uma vitória".',
    options: [
      {
        text: 'Aposto de novo, já está na hora de ganhar',
        protective: false,
        feedback:
          'Perder várias vezes não aumenta a chance de ganhar na próxima. Esse pensamento é uma armadilha muito comum, e costuma aprofundar a perda.',
      },
      {
        text: 'Paro e lembro que perder seguido não muda a próxima aposta',
        protective: true,
        feedback: 'Exato. Reconhecer essa armadilha é uma das melhores proteções.',
      },
      {
        text: 'Abro o Modo pré-jogo antes de decidir',
        protective: true,
        feedback: 'Boa. Uma pausa antes de agir ajuda a decisão a ficar mais clara.',
      },
    ],
    learn: {
      title: 'A falácia do apostador',
      text: 'Cada resultado é independente do anterior: o jogo não "deve" uma vitória a ninguém. A sensação de que uma virada está chegando tem até nome, falácia do apostador, e leva muita gente a continuar apostando depois de perder.',
    },
  },
  {
    id: 's6',
    situation: 'Um amigo manda num grupo um "palpite garantido" para o jogo de hoje.',
    options: [
      {
        text: 'Coloco um valor alto, ele entende do assunto',
        protective: false,
        feedback:
          'Não existe aposta garantida. Nem quem entende muito de esporte controla o resultado, e as cotações já são feitas para a casa ganhar no conjunto.',
      },
      {
        text: 'Agradeço e digo que estou fora das apostas',
        protective: true,
        feedback: 'Boa! Dá para participar da conversa sem colocar dinheiro.',
      },
      {
        text: 'Silencio o grupo por um tempo',
        protective: true,
        feedback: 'Ótimo. Diminuir os convites para apostar é uma proteção prática.',
      },
    ],
    learn: {
      title: 'Ninguém elimina o risco',
      text: 'Palpites, "dicas quentes" e promessas de lucro certo vendem uma ideia, não um fato. O resultado de um jogo é incerto para todo mundo, e quem promete o contrário não está mostrando o risco real.',
    },
  },
];
