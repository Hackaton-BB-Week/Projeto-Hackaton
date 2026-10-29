import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { CYCLE_SECONDS, type TimerStatus } from './breathing';

// O arquivo tem ~3 min, mas é só o mesmo trecho de ~12 s repetido.
const SOUND = require('../../../assets/audios/somdarespiracaoo.mp4');

/**
 * Som ambiente do exercício de respiração. Toca enquanto o cronômetro roda,
 * pausa junto e para ao concluir/fechar. A cada novo ciclo (Inspire) o áudio
 * volta ao início, então fica sempre em sincronia com o orbe, qualquer que
 * seja a duração escolhida (1, 2 ou 5 min).
 */
export function useBreathingSound(status: TimerStatus, elapsed: number, enabled = true) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const playingRef = useRef(false);
  playingRef.current = status === 'running' && enabled;

  // Carrega uma vez e descarrega ao desmontar.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(SOUND, { isLooping: true, volume: 0.8 });
        if (cancelled) await sound.unloadAsync();
        else {
          soundRef.current = sound;
          if (playingRef.current) await sound.playAsync(); // apertou Iniciar antes de carregar
        }
      } catch {
        // Sem som não quebra o exercício.
      }
    })();
    return () => {
      cancelled = true;
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
    };
  }, []);

  // Play / pause / stop conforme o cronômetro.
  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;
    if (status === 'running' && enabled) {
      sound.playAsync().catch(() => {});
    } else if (status === 'paused') {
      sound.pauseAsync().catch(() => {});
    } else {
      sound.stopAsync().catch(() => {}); // idle/done: volta ao início
    }
  }, [status, enabled]);

  // Reinicia o trecho no começo de cada ciclo de respiração.
  useEffect(() => {
    const sound = soundRef.current;
    if (!sound || status !== 'running' || !enabled) return;
    if (elapsed > 0 && elapsed % CYCLE_SECONDS === 0) {
      sound.setPositionAsync(0).catch(() => {});
    }
  }, [elapsed, status, enabled]);
}
