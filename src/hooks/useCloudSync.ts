import { useEffect } from 'react';
import { AppState } from 'react-native';
import { applySnapshot, flushPending, pullAll } from '@/services/sync';
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

/** Ao abrir o app, traz da nuvem o que estiver mais novo; ao ir para o fundo, envia o que falta. */
export function useCloudSync() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const snapshots = await pullAll();
      for (const s of snapshots) {
        const store = SYNCED.find((st) => st.persist.getOptions().name === s.store);
        if (!store || cancelled) continue;
        if (await applySnapshot(s)) await store.persist.rehydrate();
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
