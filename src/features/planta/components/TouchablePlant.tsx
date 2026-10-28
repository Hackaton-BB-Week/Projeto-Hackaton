import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/useTheme';
import { PlantArt } from './PlantArt';

// Planta do painel: entra com um "pop" e dá um chacoalhar carinhoso quando tocada.
export function TouchablePlant({
  stage,
  wither,
  size,
}: {
  stage: number;
  wither: boolean;
  size: number;
}) {
  const { reduceMotion } = useTheme();
  const scale = useSharedValue(reduceMotion ? 1 : 0.8);
  const rot = useSharedValue(0);

  useEffect(() => {
    if (!reduceMotion) scale.value = withSpring(1, { damping: 9, stiffness: 160 });
  }, [reduceMotion, scale]);

  const wiggle = () => {
    if (reduceMotion) return;
    rot.value = withSequence(
      withTiming(-9, { duration: 90 }),
      withTiming(8, { duration: 110 }),
      withTiming(-5, { duration: 100 }),
      withTiming(3, { duration: 90 }),
      withTiming(0, { duration: 90 }),
    );
    scale.value = withSequence(withTiming(1.08, { duration: 120 }), withSpring(1, { damping: 8 }));
  };

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rot.value}deg` }],
  }));

  return (
    <Pressable
      onPress={wiggle}
      accessibilityRole="image"
      accessibilityLabel={wither ? 'Planta murcha' : 'Planta saudável'}
    >
      <Animated.View style={[style, { transformOrigin: 'bottom' }]}>
        <PlantArt stage={stage} wither={wither} size={size} animate={!reduceMotion} />
      </Animated.View>
    </Pressable>
  );
}
