import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { useGameStore } from '@/store/useGameStore';
import { showToast } from '@/components/Toast';
import { dayKey, dayNumber, missionsForDay } from './missions';
import { useMissionsStore } from './useMissionsStore';
import { useMissionPhotosStore } from './useMissionPhotosStore';

/** Data de hoje que se atualiza à meia-noite e quando o app volta do segundo plano. */
function useToday() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const sub = AppState.addEventListener('change', (st) => st === 'active' && refresh());
    const midnight = new Date(now);
    midnight.setHours(24, 0, 1, 0);
    const timer = setTimeout(refresh, midnight.getTime() - now.getTime());
    return () => {
      sub.remove();
      clearTimeout(timer);
    };
  }, [now]);

  return now;
}

/** Missões de hoje, quais já foram feitas e a ação de concluir (credita as moedas). */
export function useDailyMissions() {
  const now = useToday();
  const today = dayKey(now);
  const day = dayNumber(now);
  const { day: storedDay, done, markDone } = useMissionsStore();
  const earnCoins = useGameStore((s) => s.earnCoins);
  const addPhoto = useMissionPhotosStore((s) => s.add);

  const missions = useMemo(() => {
    const doneToday = storedDay === today ? done : [];
    return missionsForDay(day).map((m) => ({ ...m, done: doneToday.includes(m.id) }));
  }, [day, today, storedDay, done]);

  // `photoUri`: foto opcional da missão (o álbum guarda; nada é verificado).
  const complete = useCallback(
    (id: string, photoUri?: string) => {
      const mission = missions.find((m) => m.id === id);
      if (!mission || mission.done) return;
      if (!markDone(id, today)) return;
      earnCoins(mission.reward);
      if (photoUri) addPhoto(mission, photoUri);
      showToast(
        photoUri
          ? `Missão concluída · +${mission.reward} moedas · foto no álbum`
          : `Missão concluída · +${mission.reward} moedas`,
      );
    },
    [missions, markDone, today, earnCoins, addPhoto],
  );

  const doneCount = missions.filter((m) => m.done).length;
  return { missions, complete, doneCount, total: missions.length };
}
