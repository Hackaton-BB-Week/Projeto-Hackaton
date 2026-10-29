// Canais oficiais de apoio. Esta lista embutida é a fonte de verdade offline:
// a tela de Ajuda nunca pode ficar vazia, mesmo sem internet ou sem Supabase.
// A tabela `help_channels` (supabase/help.sql) permite atualizar textos sem nova versão do app.
// Só informação pública e verificada — não adicione números ou serviços sem fonte oficial.

export type HelpChannelIcon = 'phone' | 'hospital' | 'users';
export type HelpChannelTone = 'danger' | 'green' | 'brand';

export type HelpChannel = {
  id: string;
  name: string;
  description: string;
  icon: HelpChannelIcon;
  tone: HelpChannelTone;
  /** Só dígitos. Quando presente, a tela mostra "Ligar" e "Copiar". */
  phone: string | null;
};

export const LOCAL_HELP_CHANNELS: HelpChannel[] = [
  {
    id: 'cvv',
    name: 'CVV — Centro de Valorização da Vida',
    description: 'Apoio emocional e prevenção do suicídio, 24h, por telefone, chat ou e-mail.',
    icon: 'phone',
    tone: 'danger',
    phone: '188',
  },
  {
    id: 'caps',
    name: 'CAPS — Atenção Psicossocial',
    description:
      'Serviços públicos e gratuitos de saúde mental do SUS. Procure a unidade mais próxima pelo posto de saúde da sua região.',
    icon: 'hospital',
    tone: 'green',
    phone: null,
  },
  {
    id: 'jogadores-anonimos',
    name: 'Jogadores Anônimos',
    description:
      'Grupos de apoio mútuo e gratuitos, presenciais e online, para quem quer parar de apostar.',
    icon: 'users',
    tone: 'brand',
    phone: null,
  },
];
