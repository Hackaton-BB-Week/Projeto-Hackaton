import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/useTheme';

// Interruptor das Configurações (como o .switch do protótipo). Alvo de toque de 48px.
export function SettingSwitch({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  /** Lido pelo leitor de tela. */
  label: string;
}) {
  const { colors, reduceMotion } = useTheme();
  const x = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    x.value = reduceMotion ? (value ? 1 : 0) : withTiming(value ? 1 : 0, { duration: 180 });
  }, [value, reduceMotion, x]);

  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * 22 }] }));

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={8}
      style={[styles.track, { backgroundColor: value ? colors.green600 : colors.inputBorder }]}
    >
      <Animated.View style={[styles.knob, knob]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 52, height: 30, borderRadius: 999, padding: 3, justifyContent: 'center' },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#ffffff' },
});
