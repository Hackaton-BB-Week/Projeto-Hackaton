import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

// Progresso do valor guardado em direção à meta. Só aparece quando há meta.
export function GoalProgress({ percent }: { percent: number }) {
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

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  t: { fontSize: 13, fontWeight: '700', color: colors.ink },
  v: { fontSize: 13, color: colors.ink, fontVariant: ['tabular-nums'] },
  track: { height: 12, borderRadius: 999, backgroundColor: colors.sky, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: colors.gold },
});
