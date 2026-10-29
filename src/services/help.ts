import {
  LOCAL_HELP_CHANNELS,
  type HelpChannel,
  type HelpChannelIcon,
  type HelpChannelTone,
} from '@/features/help/channels';

// Dados da aba Ajuda no Supabase. Tudo aqui é opcional: sem Supabase configurado
// (ou sem internet) a tela usa a lista embutida e o exercício funciona igual.

const isConfigured = () =>
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

// Carregamento tardio: `supabase.ts` cria o client ao ser importado e quebra sem as variáveis.
const getClient = (): typeof import('./supabase').supabase =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./supabase').supabase;

const ICONS: HelpChannelIcon[] = ['phone', 'hospital', 'users'];
const TONES: HelpChannelTone[] = ['danger', 'green', 'brand'];

type HelpChannelRow = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tone: string;
  phone: string | null;
};

function toChannel(row: HelpChannelRow): HelpChannel {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: ICONS.includes(row.icon as HelpChannelIcon) ? (row.icon as HelpChannelIcon) : 'users',
    tone: TONES.includes(row.tone as HelpChannelTone) ? (row.tone as HelpChannelTone) : 'brand',
    phone: row.phone ? row.phone.replace(/\D/g, '') || null : null,
  };
}

/** Canais oficiais de apoio (tabela pública `help_channels`). */
export async function fetchHelpChannels(): Promise<HelpChannel[]> {
  if (!isConfigured()) return LOCAL_HELP_CHANNELS;
  const supabase = getClient();
  const { data, error } = await supabase
    .from('help_channels')
    .select('id, name, description, icon, tone, phone')
    .eq('active', true)
    .order('sort_order');
  if (error) throw error;
  // Tabela vazia nunca pode esconder os canais.
  return data?.length ? (data as HelpChannelRow[]).map(toChannel) : LOCAL_HELP_CHANNELS;
}

/**
 * Registra um exercício de respiração concluído. Só grava para quem está logado;
 * sem sessão, não faz nada (o exercício não depende disso).
 */
export async function logBreathingSession(durationSeconds: number): Promise<void> {
  if (!isConfigured()) return;
  const supabase = getClient();
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return;
  const { error } = await supabase
    .from('breathing_sessions')
    .insert({ user_id: userId, duration_seconds: durationSeconds });
  if (error) throw error;
}
