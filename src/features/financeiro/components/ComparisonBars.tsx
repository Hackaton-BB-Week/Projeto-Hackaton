import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '@/theme/tokens';
import { useTheme, type Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatBRL } from '@/lib/format';
import type { BarTone, ComparisonBar } from '../finance';

// Barras horizontais comparando os quatro valores (largura relativa ao maior).
export function ComparisonBars({ bars }: { bars: ComparisonBar[] }) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  // Cores das barras seguem o tema (no modo daltonismo, azul/laranja).
  const TONE: Record<BarTone, string> = {
    notBet: colors.green,
    saved: colors.brand,
    losses: colors.danger,
    goal: colors.gold,
  };
  return (
    <View style={styles.list}>
      {bars.map((b) => (
        <View
          key={b.key}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`${b.label}: ${formatBRL(b.value)}`}
        >
          <View style={styles.row}>
            <Text style={styles.label}>{b.label}</Text>
            <Text style={styles.value}>{formatBRL(b.value)}</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${b.percent}%`, backgroundColor: TONE[b.key] }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: fs(12), color: colors.ink },
  value: { fontSize: fs(12), color: colors.ink, fontVariant: ['tabular-nums'] },
  track: { height: 10, borderRadius: 999, backgroundColor: colors.bg, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
});
