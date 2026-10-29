import { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Sheet } from '@/components/Sheet';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Eyebrow } from '@/components/Eyebrow';
import { useTheme } from '@/theme/useTheme';
import { DURATIONS, formatClock, spokenDuration } from '../breathing';
import { useBreathingTimer } from '../useBreathingTimer';
import { useBreathingSound } from '../useBreathingSound';
import { useLogBreathing } from '../useHelpChannels';

const SCALE_IDLE = 0.62;
const SCALE_DONE = 0.78;
const SCALE_STATIC = 0.85; // "reduzir animações": orbe parado

type Props = { visible: boolean; onClose: () => void };

export function BreathingSheet({ visible, onClose }: Props) {
  const { colors, fs, reduceMotion } = useTheme();
  const logBreathing = useLogBreathing();
  const timer = useBreathingTimer(logBreathing);
  const { status, remaining, total, current } = timer;
  useBreathingSound(status, timer.elapsed, visible);

  const scale = useRef(new Animated.Value(SCALE_IDLE)).current;
  const secondsLeftRef = useRef(current.secondsLeft);
  secondsLeftRef.current = current.secondsLeft;

  // Orbe: cresce ao inspirar, fica no "segure", encolhe ao expirar.
  useEffect(() => {
    if (reduceMotion) {
      scale.stopAnimation();
      scale.setValue(SCALE_STATIC);
      return;
    }
    if (status === 'running') {
      const isHold = current.phase.name === 'Segure';
      Animated.timing(scale, {
        toValue: current.phase.scale,
        duration: isHold ? 300 : secondsLeftRef.current * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else if (status === 'paused') {
      scale.stopAnimation();
    } else {
      Animated.timing(scale, {
        toValue: status === 'done' ? SCALE_DONE : SCALE_IDLE,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [status, current.index, current.phase, reduceMotion, scale]);

  const phaseLabel =
    status === 'idle'
      ? 'Pronto para começar'
      : status === 'done'
        ? 'Muito bem 💛'
        : current.phase.name;

  // iOS não tem "live region": anuncia a troca de fase para quem usa leitor de tela.
  useEffect(() => {
    if (Platform.OS === 'ios' && (status === 'running' || status === 'done')) {
      AccessibilityInfo.announceForAccessibility(phaseLabel);
    }
  }, [phaseLabel, status]);

  const close = () => {
    timer.reset();
    onClose();
  };

  const startLabel = status === 'running' ? 'Pausar' : status === 'paused' ? 'Retomar' : 'Iniciar';

  return (
    <Sheet visible={visible} title="Respiração guiada" onClose={close}>
      <Card style={styles.center}>
        <Animated.View
          style={[styles.orb, { backgroundColor: colors.gold, transform: [{ scale }] }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View style={styles.orbGlow} />
        </Animated.View>
        <Text
          style={[styles.phase, { color: colors.ink, fontSize: fs(22) }]}
          accessibilityLiveRegion="polite"
        >
          {phaseLabel}
        </Text>
        <Text
          style={[styles.time, { color: colors.muted, fontSize: fs(14) }]}
          accessibilityLabel={
            status === 'done' ? 'Exercício concluído' : `Faltam ${spokenDuration(remaining)}`
          }
        >
          {status === 'done' ? 'Exercício concluído' : formatClock(remaining)}
        </Text>
      </Card>

      <View style={styles.section}>
        <Eyebrow>Duração</Eyebrow>
        <View style={styles.durRow} accessibilityRole="radiogroup">
          {DURATIONS.map((d) => {
            const selected = d.seconds === total;
            const locked = status === 'running';
            return (
              <Pressable
                key={d.seconds}
                onPress={() => timer.setDuration(d.seconds)}
                disabled={locked}
                accessibilityRole="radio"
                accessibilityLabel={spokenDuration(d.seconds)}
                accessibilityState={{ checked: selected, disabled: locked }}
                style={[
                  styles.dur,
                  {
                    backgroundColor: selected ? colors.brandSoft : colors.surface,
                    borderColor: selected ? colors.brand : colors.line,
                  },
                  locked && !selected && styles.durLocked,
                ]}
              >
                <Text
                  style={[
                    styles.durTxt,
                    { color: selected ? colors.brand700 : colors.ink, fontSize: fs(13) },
                  ]}
                >
                  {d.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label={startLabel}
          onPress={timer.toggle}
          style={styles.flex}
          accessibilityHint={status === 'running' ? 'Pausa mantendo o tempo restante' : undefined}
        />
        <Button
          label="Reiniciar"
          variant="outline"
          onPress={timer.reset}
          style={styles.flex}
          accessibilityHint="Volta o cronômetro para a duração escolhida"
        />
      </View>

      <Text style={[styles.hint, { color: colors.muted, fontSize: fs(12.5) }]}>
        Siga o círculo: inspire enquanto ele cresce, segure, e solte enquanto ele diminui. Encerre
        quando quiser.
      </Text>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingVertical: 20 },
  orb: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginVertical: 6,
    overflow: 'hidden',
  },
  orbGlow: {
    position: 'absolute',
    top: 14,
    left: 22,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffe79a',
    opacity: 0.85,
  },
  phase: { fontWeight: '700', marginTop: 8, textAlign: 'center' },
  time: { marginTop: 2, fontVariant: ['tabular-nums'] },
  section: { gap: 10 },
  durRow: { flexDirection: 'row', gap: 8 },
  dur: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durLocked: { opacity: 0.5 },
  durTxt: { fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1, alignSelf: 'auto' },
  hint: { textAlign: 'center', lineHeight: 18 },
});
