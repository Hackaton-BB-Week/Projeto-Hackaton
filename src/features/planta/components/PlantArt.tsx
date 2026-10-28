import { useEffect } from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSettingsStore } from '@/store/useSettingsStore';
import { tintFor } from '@/theme/colorblind';

// Desenho da planta por estágio (porta do plantMiniSVG do protótipo).
const AnimatedG = Animated.createAnimatedComponent(G);

/** Filtro do modo daltonismo para as cores da planta. */
function useTint() {
  return tintFor(useSettingsStore((s) => s.colorblind));
}

const STEM_TOP = [150, 124, 100, 76, 58, 44];

function leaf(x: number, y: number, dir: -1 | 1, s: number) {
  const dx = 26 * s * dir;
  const dy = 10 * s;
  return `M${x} ${y} q ${dx * 0.6} ${-dy * 1.6} ${dx} ${-dy * 0.4} q ${-dx * 0.5} ${dy * 1.4} ${-dx} ${dy * 0.4} Z`;
}

function Flower({ cx, cy, s, wither }: { cx: number; cy: number; s: number; wither: boolean }) {
  const c = useTint();
  const petal = wither ? c('#e0a24a') : c('#ffd45e');
  const center = wither ? c('#c97b1e') : c('#ff9f1c');
  return (
    <G>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return (
          <Circle
            key={i}
            cx={cx + Math.cos(a) * 11 * s}
            cy={cy + Math.sin(a) * 11 * s}
            r={7 * s}
            fill={petal}
          />
        );
      })}
      <Circle cx={cx} cy={cy} r={7 * s} fill={center} />
    </G>
  );
}

export function PlantArt({
  stage,
  wither,
  size = 72,
  animate = true,
}: {
  stage: number;
  wither: boolean;
  size?: number;
  animate?: boolean;
}) {
  const c = useTint();
  const rot = useSharedValue(wither ? 4 : 0);

  useEffect(() => {
    cancelAnimation(rot);
    if (!animate) {
      rot.value = wither ? 4 : 0;
      return;
    }
    // Saudável: balança de leve. Murcha: inclinada, quase parada.
    const [a, b, ms] = wither ? [3, 5, 2500] : [-2, 2, 2250];
    rot.value = a;
    rot.value = withRepeat(
      withSequence(
        withTiming(b, { duration: ms, easing: Easing.inOut(Easing.sin) }),
        withTiming(a, { duration: ms, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
    return () => cancelAnimation(rot);
  }, [animate, wither, rot]);

  const animatedProps = useAnimatedProps(() => ({
    rotation: rot.value,
    originX: 100,
    originY: 150,
  }));

  const st = Math.max(0, Math.min(5, stage));
  const top = STEM_TOP[st];
  const stem = wither ? c('#8a6a3a') : c('#1f9b57');
  const gradId = wither ? 'lfw' : 'lfh';

  return (
    <Svg width={size} height={size} viewBox="40 40 120 130">
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={wither ? c('#d59a4a') : c('#4fc27e')} />
          <Stop offset="1" stopColor={wither ? c('#b5651d') : c('#1f9b57')} />
        </LinearGradient>
      </Defs>
      <Circle cx={100} cy={100} r={60} fill={wither ? c('#f3e7d2') : c('#eaf6ff')} />
      <AnimatedG animatedProps={animatedProps}>
        {st >= 1 && (
          <Path
            d={`M100 150 L100 ${top}`}
            stroke={stem}
            strokeWidth={st >= 3 ? 6 : 5}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {st >= 1 && (
          <>
            <Path d={leaf(100, 138, -1, 0.7)} fill={`url(#${gradId})`} />
            <Path d={leaf(100, 138, 1, 0.7)} fill={`url(#${gradId})`} />
          </>
        )}
        {st >= 2 && (
          <>
            <Path d={leaf(100, 118, -1, 0.85)} fill={`url(#${gradId})`} />
            <Path d={leaf(100, 110, 1, 0.85)} fill={`url(#${gradId})`} />
          </>
        )}
        {st >= 3 && (
          <>
            <Path d={leaf(100, 96, -1, 0.95)} fill={`url(#${gradId})`} />
            <Path d={leaf(100, 88, 1, 0.95)} fill={`url(#${gradId})`} />
          </>
        )}
        {st === 3 && <Circle cx={100} cy={top} r={5} fill={wither ? c('#c9a46a') : c('#6fcf97')} />}
        {st >= 4 && <Flower cx={100} cy={top} s={0.72} wither={wither} />}
      </AnimatedG>
      <Path d="M86 150 L114 150 L110 168 Q100 172 90 168 Z" fill={c('#d08b5b')} />
    </Svg>
  );
}
