import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Pressable do gesture-handler: o toque não é engolido pelo gesto do mapa.
import { Pressable } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/useTheme';
import { usePlant, usePlantUi, type PlantFx } from '../usePlant';
import { PlantArt } from './PlantArt';

const AMBER = '#bb6a1e';
const SIZE = 54;
const FX_LABEL: Record<PlantFx, string | null> = {
  water: '+1 dia',
  grow: 'Cresceu!',
  heal: 'Recuperada!',
  relapse: null,
};
const RING_COLOR: Record<PlantFx, string> = {
  water: '#5aa9e6',
  grow: '#ffc62b',
  heal: '#1f9b57',
  relapse: AMBER,
};
const SPARKLE_ANGLES = [-150, -90, -30, 30, 150].map((d) => (d * Math.PI) / 180);

/** Brilhinho que sai da planta numa direção. */
function Sparkle({ progress, angle }: { progress: SharedValue<number>; angle: number }) {
  const style = useAnimatedStyle(() => {
    const r = 22 + progress.value * 26;
    return {
      opacity: progress.value > 0 && progress.value < 1 ? 1 - progress.value : 0,
      transform: [
        { translateX: Math.cos(angle) * r },
        { translateY: Math.sin(angle) * r },
        { scale: 1 - progress.value * 0.5 },
      ],
    };
  });
  return <Animated.View pointerEvents="none" style={[styles.sparkle, style]} />;
}

// Bolinha da planta no canto superior direito do mapa. Toque abre o painel.
// Reage às ações da pessoa com micro-animações (gota, crescer, recuperar).
export function PlantBadge() {
  const { colors, reduceMotion } = useTheme();
  const p = usePlant();
  const open = usePlantUi((s) => s.open);
  const fx = usePlantUi((s) => s.fx);
  const [fxKind, setFxKind] = useState<PlantFx>('water');

  const press = useSharedValue(1);
  const pop = useSharedValue(1);
  const drop = useSharedValue(0);
  const ring = useSharedValue(0);
  const sparkle = useSharedValue(0);
  const label = useSharedValue(0);

  useEffect(() => {
    if (!fx || reduceMotion) return;
    setFxKind(fx.kind);
    const ease = Easing.out(Easing.cubic);
    const run = (v: SharedValue<number>, ms: number, delay = 0) => {
      v.value = 0;
      v.value = withDelay(delay, withTiming(1, { duration: ms, easing: ease }));
    };
    const burst = (big: number, delay = 0) =>
      withDelay(
        delay,
        withSequence(withTiming(big, { duration: 140 }), withSpring(1, { damping: 7 })),
      );
    const fallDrop = () => {
      drop.value = 0;
      drop.value = withTiming(1, { duration: 420, easing: Easing.in(Easing.quad) });
    };

    if (fx.kind === 'water') {
      fallDrop();
      pop.value = burst(1.14, 380);
      run(ring, 650, 380);
      run(label, 1000, 420);
    } else if (fx.kind === 'grow') {
      fallDrop();
      pop.value = burst(1.28, 380);
      run(ring, 650, 380);
      run(sparkle, 750, 400);
      run(label, 1000, 450);
    } else if (fx.kind === 'heal') {
      pop.value = burst(1.18);
      run(ring, 650);
      run(sparkle, 750);
      run(label, 1000, 80);
    } else {
      // Recaída: só um encolher suave. Nada punitivo.
      pop.value = withSequence(
        withTiming(0.9, { duration: 260 }),
        withSpring(1, { damping: 12, stiffness: 90 }),
      );
    }
  }, [fx, reduceMotion, pop, drop, ring, sparkle, label]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value * pop.value }],
  }));
  const dropStyle = useAnimatedStyle(() => ({
    opacity: drop.value > 0 && drop.value < 1 ? 1 : 0,
    transform: [{ translateY: -42 + drop.value * 34 }, { rotate: '45deg' }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ring.value > 0 && ring.value < 1 ? 0.9 * (1 - ring.value) : 0,
    transform: [{ scale: 1 + ring.value * 0.9 }],
  }));
  const labelStyle = useAnimatedStyle(() => ({
    opacity: label.value > 0 && label.value < 1 ? 1 - label.value : 0,
    transform: [{ translateY: -label.value * 30 }],
  }));

  const labelText = FX_LABEL[fxKind];

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Animated.View
        pointerEvents="none"
        style={[styles.ring, { borderColor: RING_COLOR[fxKind] }, ringStyle]}
      />
      {SPARKLE_ANGLES.map((a) => (
        <Sparkle key={a} progress={sparkle} angle={a} />
      ))}
      <Pressable
        onPress={() => open('plant')}
        onPressIn={() => {
          if (!reduceMotion) press.value = withTiming(0.9, { duration: 90 });
        }}
        onPressOut={() => {
          press.value = withSpring(1, { damping: 8 });
        }}
        accessibilityRole="button"
        accessibilityLabel={`Sua planta: ${p.wither ? 'precisando de cuidado' : `${p.stageName}, saudável`}`}
        accessibilityHint="Abre as informações da planta"
        hitSlop={6}
      >
        <Animated.View style={[styles.badge, { shadowColor: colors.shadow }, badgeStyle]}>
          <PlantArt stage={p.stage} wither={p.wither} size={50} animate={!reduceMotion} />
          <View style={[styles.dot, { backgroundColor: p.wither ? AMBER : colors.green600 }]} />
        </Animated.View>
      </Pressable>
      <Animated.View pointerEvents="none" style={[styles.drop, dropStyle]} />
      {labelText && (
        <Animated.View pointerEvents="none" style={[styles.label, labelStyle]}>
          <Text style={styles.labelTxt}>{labelText}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  badge: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 3,
  },
  sparkle: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ffc62b',
  },
  // Gota d'água: quadrado com três cantos arredondados, girado 45°.
  drop: {
    position: 'absolute',
    top: 2,
    width: 12,
    height: 12,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: '#5aa9e6',
  },
  label: {
    position: 'absolute',
    right: SIZE + 4,
    top: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    shadowColor: '#122744',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  labelTxt: { fontSize: 12, fontWeight: '800', color: '#157a43' },
});
