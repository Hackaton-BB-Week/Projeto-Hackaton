import { useEffect } from 'react';
import { AppState } from 'react-native';
import { applySnapshot, flushPending, pullAll, pushIfNewer, type Snapshot } from '@/services/sync';
import { useGameStore } from '@/store/useGameStore';
import { usePlantStore } from '@/store/usePlantStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUserStore } from '@/store/useUserStore';
import { useVilaStore } from '@/store/useVilaStore';
import { useEscolhaStore } from '@/features/escolha/useEscolhaStore';
import { useMissionsStore } from '@/features/missoes/useMissionsStore';
import { usePreJogoStore } from '@/features/prejogo/usePreJogoStore';

// Stores que vão para a nuvem. As fotos das missões ficam de fora: são arquivos do aparelho.
const SYNCED = [
  useUserStore,
  useGameStore,
  usePlantStore,
  useVilaStore,
  useSettingsStore,
  useMissionsStore,
  useEscolhaStore,
  usePreJogoStore,
];

/** Troca o progresso do aparelho pelo da conta que acabou de entrar. */
export async function restoreSnapshots(snapshots: Snapshot[]) {
  for (const store of SYNCED) {
    const remote = snapshots.find((s) => s.store === store.persist.getOptions().name);
    if (remote && (await applySnapshot(remote, true))) await store.persist.rehydrate();
  }
}

/**
 * Ao abrir o app, traz da nuvem o que estiver mais novo e envia o que o aparelho tiver de
 * mais novo (ex.: mudou sem internet). Ao ir para o fundo, envia o que estiver esperando.
 */
export function useCloudSync() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const snapshots = await pullAll();
      if (!snapshots) return; // sem Supabase ou sem internet: segue só com o aparelho
      for (const store of SYNCED) {
        if (cancelled) return;
        const name = store.persist.getOptions().name!;
        const remote = snapshots.find((s) => s.store === name);
        if (remote && (await applySnapshot(remote))) await store.persist.rehydrate();
        else await pushIfNewer(name, remote?.updated_at);
      }
    })().catch(() => {});

    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') flushPending();
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);
}
