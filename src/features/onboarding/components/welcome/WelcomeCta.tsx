import { Pressable, Text, View, StyleSheet } from 'react-native';
import { GoldGradient } from './art';

// Botão principal das boas-vindas: degradê dourado com brilho, como no design.
export function WelcomeCta({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
    >
      <View style={StyleSheet.absoluteFill}>
        <GoldGradient />
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
    // Brilho dourado (iOS: shadow*, Android: elevation).
    shadowColor: '#ffc62b',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    backgroundColor: '#ffc62b',
  },
  pressed: { transform: [{ translateY: 1 }], opacity: 0.95 },
  txt: { color: '#5a3f00', fontSize: 15, fontWeight: '700' },
});
