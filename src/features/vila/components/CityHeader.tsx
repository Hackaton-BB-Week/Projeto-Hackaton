import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme/tokens';

interface Props {
  name: string;
  done: number;
  total: number;
}

// Nome da cidade e barra de progresso das obras (só avança quando a pessoa constrói).
export default function CityHeader({ name, done, total }: Props) {
  return (
    <View style={styles.c}>
      <View style={styles.row}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.count}>
          {done}/{total} obras
        </Text>
      </View>
      <View
        style={styles.track}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`${done} de ${total} obras concluídas`}
        accessibilityValue={{ min: 0, max: total, now: done }}
      >
        <View style={[styles.fill, { width: `${(done / total) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  name: { fontSize: 18, fontWeight: '700', color: colors.ink },
  count: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  track: { height: 8, borderRadius: radius.sm, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.sm, backgroundColor: colors.green },
});
