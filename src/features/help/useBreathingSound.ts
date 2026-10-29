import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { CYCLE_SECONDS, type TimerStatus } from './breathing';

// O arquivo tem ~3 min, mas é só o mesmo trecho de ~12 s repetido.
const SOUND = require('../../../assets/audios/somdarespiracaoo.mp4');

const VOLUME = 0.8;
const FADE_MS = 600;
const FADE_STEPS = 12;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Som ambiente do exercício de respiração. Toca enquanto o cronômetro roda,
 * pausa junto e, ao concluir, reiniciar ou fechar, baixa o volume aos poucos
 * antes de parar (sem corte súbito). A cada novo ciclo (Inspire) o áudio
 * volta ao início, então fica sempre em sincronia com o orbe, qualquer que
 * seja a duração escolhida (1, 2 ou 5 min).
 */
export function useBreathingSound(status: TimerStatus, elapsed: number, enabled = true) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const playingRef = useRef(false);
  playingRef.current = status === 'running' && enabled;
  // Cada fade ganha um número; se o usuário der play no meio, o fade antigo desiste.
  const fadeIdRef = useRef(0);

  /** Baixa o volume até zero, para e volta ao início, pronto para a próxima vez. */
  const fadeOutAndStop = async (sound: Audio.Sound) => {
    const id = ++fadeIdRef.current;
    try {
      const st = await sound.getStatusAsync();
      if (st.isLoaded && st.isPlaying) {
        const from = st.volume;
        for (let i = 1; i <= FADE_STEPS; i++) {
          if (fadeIdRef.current !== id) return;
          await sound.setVolumeAsync(from * (1 - i / FADE_STEPS));
          await wait(FADE_MS / FADE_STEPS);
        }
      }
      if (fadeIdRef.current !== id) return;
      await sound.stopAsync();
      await sound.setVolumeAsync(VOLUME);
    } catch {
      // som já descarregado: nada a fazer
    }
  };

  // Carrega uma vez e descarrega ao desmontar.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(SOUND, { isLooping: true, volume: VOLUME });
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
      const sound = soundRef.current;
      soundRef.current = null;
      // Saiu da tela de Ajuda: some suave e só então libera o áudio.
      if (sound) fadeOutAndStop(sound).finally(() => sound.unloadAsync().catch(() => {}));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play / pause / stop conforme o cronômetro.
  const prevStatusRef = useRef(status);
  useEffect(() => {
    const sound = soundRef.current;
    const resuming = prevStatusRef.current === 'paused';
    prevStatusRef.current = status;
    if (!sound) return;
    if (status === 'running' && enabled) {
      fadeIdRef.current++; // cancela um fade em andamento
      // Retomar continua de onde parou; começar de novo volta ao início do trecho.
      (resuming ? Promise.resolve() : sound.setPositionAsync(0))
        .then(() => sound.setVolumeAsync(VOLUME))
        .then(() => sound.playAsync())
        .catch(() => {});
    } else if (status === 'paused') {
      sound.pauseAsync().catch(() => {});
    } else {
      fadeOutAndStop(sound); // idle/done/fechou: some suave e volta ao início
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
