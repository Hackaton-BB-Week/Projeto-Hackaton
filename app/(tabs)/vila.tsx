import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

// Jogo principal (stub). Implementar cena + obras em src/features/vila.
export default function Vila() {
  return (
    <View style={styles.c}>
      <Text style={styles.h}>Vila que Rende</Text>
      <Text style={styles.p}>Reforme a vila com as moedas que você conquista.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.sky, padding: 20, gap: 8, justifyContent: 'center' },
  h: { fontSize: 22, fontWeight: '700', color: colors.ink },
  p: { fontSize: 14, color: colors.muted },
});
