import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

// Bloco de número grande + legenda (ex.: "R$ 120 · deixou de apostar").
export function FinanceStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={styles.c} accessible accessibilityLabel={`${value}, ${label}`}>
      <Text style={[styles.v, { color }]}>{value}</Text>
      <Text style={styles.l}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
  },
  v: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  l: { fontSize: 11, color: colors.muted, marginTop: 2 },
});
