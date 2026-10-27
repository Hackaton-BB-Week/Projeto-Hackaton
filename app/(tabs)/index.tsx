import { View, Text, StyleSheet } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { formatBRL, formatCoins } from '@/lib/format';
import { colors } from '@/theme/tokens';

// Hub (stub). Mostra as métricas derivadas do store.
export default function Hub() {
  const { coins, preserved, multiplier } = useProfile();
  return (
    <View style={styles.c}>
      <Text style={styles.h}>Olá!</Text>
      <Text style={styles.m}>Moedas: {formatCoins(coins)}</Text>
      <Text style={styles.m}>Preservado: {formatBRL(preserved)}</Text>
      <Text style={styles.m}>Multiplicador: x{multiplier}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.sky, padding: 20, gap: 8, justifyContent: 'center' },
  h: { fontSize: 24, fontWeight: '700', color: colors.ink },
  m: { fontSize: 15, color: colors.muted },
});
