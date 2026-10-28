import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Coin, IsoHouse, ROOF, SunflowerHead, SunflowerStem } from './art';

const STEM_W = 84;
const HOUSE_W = 88;

/**
 * Cena de abertura: a moeda cai, o girassol brota e as casinhas da vila surgem.
 * Tudo uma vez só, ao abrir — previsível, sem nada de sorte. Com "reduzir
 * animações" a cena já aparece pronta.
 */
export function HeroScene({ reduceMotion }: { reduceMotion: boolean }) {
  const start = reduceMotion ? 1 : 0;
  const coin = useSharedValue(start);
  const float = useSharedValue(0);
  const stem = useSharedValue(start);
  const head = useSharedValue(start);
  const sway = useSharedValue(0);
  const house1 = useSharedValue(start);
  const house2 = useSharedValue(start);

  useEffect(() => {
    if (reduceMotion) {
      [coin, stem, head, house1, house2].forEach((v) => (v.value = 1));
      float.value = 0;
      sway.value = 0;
      return;
    }
    const spring = { damping: 12, stiffness: 120 };
    const ease = Easing.out(Easing.cubic);
    coin.value = withDelay(150, withSpring(1, spring));
    stem.value = withDelay(350, withTiming(1, { duration: 750, easing: ease }));
    head.value = withDelay(1000, withSpring(1, { damping: 9, stiffness: 160 }));
    house1.value = withDelay(650, withSpring(1, spring));
    house2.value = withDelay(820, withSpring(1, spring));
    // Movimento contínuo bem leve depois da entrada.
    const loop = (amp: number, ms: number) =>
      withRepeat(
        withSequence(
          withTiming(amp, { duration: ms, easing: Easing.inOut(Easing.sin) }),
          withTiming(-amp, { duration: ms, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    float.value = withDelay(1100, loop(4, 1800));
    sway.value = withDelay(1500, loop(2, 2200));
  }, [reduceMotion, coin, float, stem, head, sway, house1, house2]);

  const coinStyle = useAnimatedStyle(() => ({
    opacity: coin.value,
    transform: [
      { translateY: (1 - coin.value) * -36 + float.value },
      { scale: 0.6 + coin.value * 0.4 },
    ],
  }));
  const flowerStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${sway.value}deg` }] }));
  const stemStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, stem.value * 3),
    transform: [{ scaleY: stem.value }],
  }));
  const headStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, head.value * 2),
    transform: [{ scale: head.value }],
  }));
  const h1Style = useAnimatedStyle(() => ({
    opacity: Math.min(1, house1.value * 1.5),
    transform: [{ translateY: (1 - house1.value) * 18 }, { scale: 0.85 + house1.value * 0.15 }],
  }));
  const h2Style = useAnimatedStyle(() => ({
    opacity: Math.min(1, house2.value * 1.5),
    transform: [{ translateY: (1 - house2.value) * 18 }, { scale: 0.85 + house2.value * 0.15 }],
  }));

  return (
    <View style={styles.scene} accessible={false} importantForAccessibility="no-hide-descendants">
      <Animated.View style={[styles.coin, coinStyle]}>
        <Coin size={88} />
      </Animated.View>

      <View style={styles.ground}>
        <Animated.View style={[styles.flower, flowerStyle]}>
          <Animated.View style={[styles.stem, stemStyle]}>
            <SunflowerStem width={STEM_W} />
          </Animated.View>
          <Animated.View style={[styles.head, headStyle]}>
            <SunflowerHead size={22} />
          </Animated.View>
        </Animated.View>
        <Animated.View style={h1Style}>
          <IsoHouse width={HOUSE_W} roof={ROOF.green} />
        </Animated.View>
        <Animated.View style={[styles.house2, h2Style]}>
          <IsoHouse width={HOUSE_W} roof={ROOF.red} />
        </Animated.View>
      </View>
    </View>
  );
}

const STEM_H = STEM_W * (60 / 68);

const styles = StyleSheet.create({
  scene: { height: 190, justifyContent: 'flex-end' },
  coin: { position: 'absolute', top: 0, right: 34 },
  ground: { flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 52 },
  flower: { width: STEM_W, height: STEM_H + 14, marginRight: 4, transformOrigin: 'bottom' },
  stem: { position: 'absolute', bottom: 0, transformOrigin: 'bottom' },
  // Miolo centrado no topo do caule (x = 36/68 da largura; topo a 58/60 da altura).
  head: { position: 'absolute', left: STEM_W * (36 / 68) - 11, bottom: STEM_H * (58 / 60) - 11 },
  house2: { marginLeft: -6 },
});
