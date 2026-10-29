import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

// Progresso salvo na nuvem (tabela app_state, ver supabase/sync.sql). O aparelho continua
// sendo a fonte rápida: tudo grava primeiro no AsyncStorage e sobe ao Supabase em segundo
// plano. Sem Supabase configurado, sem internet ou com erro, nada quebra: só não sincroniza.

const isConfigured = () =>
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

// Carregamento tardio: `supabase.ts` cria o client ao ser importado e quebra sem as variáveis.
const getClient = (): typeof import('./supabase').supabase =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./supabase').supabase;

/** Hora da última gravação local de cada store; decide quem é mais novo na hora de baixar. */
const tsKey = (store: string) => `rqr-sync-ts:${store}`;

let session: Promise<string | null> | null = null;

/** Id do usuário, entrando com login anônimo se ainda não houver sessão salva. */
function ensureUser(): Promise<string | null> {
  if (!isConfigured()) return Promise.resolve(null);
  session ??= (async () => {
    const auth = getClient().auth;
    const { data } = await auth.getSession();
    if (data.session) return data.session.user.id;
    const { data: signed, error } = await auth.signInAnonymously();
    if (error) throw error;
    return signed.user?.id ?? null;
  })().catch(() => {
    session = null; // tenta de novo na próxima vez (ex.: voltou a internet)
    return null;
  });
  return session;
}

const pending = new Map<string, ReturnType<typeof setTimeout>>();
const queued = new Map<string, { json: string; at: string }>();

async function upload(store: string) {
  const item = queued.get(store);
  if (!item) return;
  queued.delete(store);
  const userId = await ensureUser();
  if (!userId) return;
  const { error } = await getClient()
    .from('app_state')
    .upsert({ user_id: userId, store, data: JSON.parse(item.json), updated_at: item.at });
  if (error) throw error;
}

/** Envia o estado de um store, juntando mudanças seguidas (~1 s). Nunca lança erro. */
export function pushState(store: string, json: string, at = new Date().toISOString()) {
  if (!isConfigured()) return;
  queued.set(store, { json, at });
  clearTimeout(pending.get(store));
  pending.set(
    store,
    setTimeout(() => {
      pending.delete(store);
      upload(store).catch(() => {});
    }, 1000),
  );
}

/** Envia na hora o que estiver esperando (ex.: o app foi para o fundo). */
export function flushPending() {
  for (const [store, t] of pending) {
    clearTimeout(t);
    pending.delete(store);
    upload(store).catch(() => {});
  }
}

export type Snapshot = { store: string; data: unknown; updated_at: string };

/** Estados salvos na nuvem para este usuário (null sem Supabase, sem internet ou com erro). */
export async function pullAll(): Promise<Snapshot[] | null> {
  try {
    const userId = await ensureUser();
    if (!userId) return null;
    const { data, error } = await getClient()
      .from('app_state')
      .select('store, data, updated_at')
      .eq('user_id', userId);
    if (error) throw error;
    return data ?? [];
  } catch {
    return null;
  }
}

/**
 * Grava no aparelho o estado vindo da nuvem, se ele for mais novo que o local.
 * Retorna true quando gravou (o store precisa reidratar).
 */
export async function applySnapshot(s: Snapshot): Promise<boolean> {
  const localAt = await AsyncStorage.getItem(tsKey(s.store));
  if (localAt && new Date(localAt) >= new Date(s.updated_at)) return false;
  await AsyncStorage.multiSet([
    [s.store, JSON.stringify(s.data)],
    [tsKey(s.store), s.updated_at],
  ]);
  return true;
}

/**
 * Envia o estado local se ele for mais novo que o da nuvem (ou se a nuvem não tiver nada):
 * cobre o que mudou sem internet. `remoteAt` é o updated_at baixado em pullAll.
 */
export async function pushIfNewer(store: string, remoteAt?: string) {
  const [[, json], [, localAt]] = await AsyncStorage.multiGet([store, tsKey(store)]);
  if (!json || !localAt) return;
  if (remoteAt && new Date(localAt) <= new Date(remoteAt)) return;
  pushState(store, json, localAt);
}

/** Storage do `persist` do Zustand: AsyncStorage + cópia na nuvem em segundo plano. */
export const syncedStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: async (name, value) => {
    // Ao abrir, a hidratação regrava o mesmo estado: isso não pode contar como mudança,
    // senão o aparelho sempre pareceria mais novo e apagaria o que veio da nuvem.
    if ((await AsyncStorage.getItem(name)) === value) return;
    const at = new Date().toISOString();
    await AsyncStorage.multiSet([
      [name, value],
      [tsKey(name), at],
    ]);
    pushState(name, value, at);
  },
  removeItem: (name) => AsyncStorage.multiRemove([name, tsKey(name)]),
};
