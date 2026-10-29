import { View, Text, StyleSheet } from 'react-native';
import type { Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';

// Progresso do valor guardado em direção à meta. Só aparece quando há meta.
export function GoalProgress({ percent }: { percent: number }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Progresso da meta"
      accessibilityValue={{ min: 0, max: 100, now: percent, text: `${percent}%` }}
    >
      <View style={styles.row}>
        <Text style={styles.t}>Progresso da meta</Text>
        <Text style={styles.v}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  t: { fontSize: fs(13), fontWeight: '700', color: colors.ink },
  v: { fontSize: fs(13), color: colors.ink, fontVariant: ['tabular-nums'] },
  track: { height: 12, borderRadius: 999, backgroundColor: colors.bg, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: colors.gold },
});
