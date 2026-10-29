import { Pressable, Text, View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '@/theme/useTheme';

// Botão principal das boas-vindas: degradê verde com brilho, como os botões principais do app.
export function WelcomeCta({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.btn,
        { shadowColor: colors.success, backgroundColor: colors.success },
        pressed && styles.pressed,
      ]}
    >
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1 1">
          <Defs>
            <LinearGradient id="welcome-cta" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.success2} />
              <Stop offset="1" stopColor={colors.success} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={1} height={1} fill="url(#welcome-cta)" />
        </Svg>
      </View>
      <Text style={styles.txt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 52,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    // Brilho (iOS: shadow*, Android: elevation).
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  pressed: { transform: [{ translateY: 1 }], opacity: 0.95 },
  txt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
