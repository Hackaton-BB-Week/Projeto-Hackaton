import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';
import { useTheme } from '@/theme/useTheme';

// Aviso curto no rodapé. Em qualquer lugar: `showToast('Número copiado')`.
// O <ToastHost /> fica montado uma vez em app/_layout.tsx.

type ToastState = { message: string | null; key: number };
const useToastStore = create<ToastState>(() => ({ message: null, key: 0 }));

let hideTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string, durationMs = 2400) {
  useToastStore.setState((s) => ({ message, key: s.key + 1 }));
  AccessibilityInfo.announceForAccessibility(message);
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => useToastStore.setState({ message: null }), durationMs);
}

export function ToastHost() {
  const { message, key } = useToastStore();
  const { colors, fs, reduceMotion } = useTheme();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const to = message ? 1 : 0;
    if (reduceMotion) opacity.setValue(to);
    else Animated.timing(opacity, { toValue: to, duration: 220, useNativeDriver: true }).start();
  }, [message, key, reduceMotion, opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { opacity, backgroundColor: colors.navy, bottom: insets.bottom + 76 }]}
      accessibilityLiveRegion="polite"
    >
      {message ? <Text style={[styles.txt, { fontSize: fs(13) }]}>{message}</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '88%',
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  txt: { color: '#ffffff', fontWeight: '600', textAlign: 'center' },
});
