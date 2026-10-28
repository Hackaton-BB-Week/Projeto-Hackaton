import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing } from '@/theme/tokens';
import type { Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';

// Bloco de número grande + legenda (ex.: "R$ 120 · deixou de apostar").
export function FinanceStat({ value, label, color }: { value: string; label: string; color: string }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.c} accessible accessibilityLabel={`${value}, ${label}`}>
      <Text style={[styles.v, { color }]}>{value}</Text>
      <Text style={styles.l}>{label}</Text>
    </View>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  c: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
  },
  v: { fontSize: fs(18), fontWeight: '700', fontVariant: ['tabular-nums'] },
  l: { fontSize: fs(11), color: colors.muted, marginTop: 2 },
});
