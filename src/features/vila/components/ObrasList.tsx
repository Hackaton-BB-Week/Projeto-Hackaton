import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { City, Plot } from '../data/cities';
import { BuildingPreview } from '../scene/CityScene';
import { isAvailable, type BuiltMap } from '@/store/useVilaStore';
import { radius, spacing } from '@/theme/tokens';
import { useTheme, type Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';

interface Props {
  city: City;
  built: BuiltMap;
  onOpen: (plotId: string) => void;
}

const obrasText = (n: number) => `${n} ${n === 1 ? 'obra' : 'obras'}`;

// Lista "Construir a vila", agrupada por zona, igual ao protótipo.
export default function ObrasList({ city, built, onOpen }: Props) {
  const styles = useThemedStyles(makeStyles);
  const zones = [...new Set(city.plots.map((p) => p.zone))];
  return (
    <View style={styles.c}>
      {zones.map((zone) => {
        const list = city.plots.filter((p) => p.zone === zone);
        const done = list.filter((p) => built[p.id]).length;
        return (
          <View key={zone} style={styles.zone}>
            <View style={styles.zoneHead}>
              <Text style={styles.zoneTitle}>{zone}</Text>
              <Text style={styles.zoneCount}>
                {done}/{list.length}
              </Text>
            </View>
            <View style={styles.grid}>
              {list.map((p) => (
                <ObraCard key={p.id} plot={p} built={built} onPress={() => onOpen(p.id)} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function ObraCard({ plot, built, onPress }: { plot: Plot; built: BuiltMap; onPress: () => void }) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const done = !!built[plot.id];
  const available = isAvailable(plot, built);
  const status = done
    ? 'Concluída'
    : available
      ? `${plot.cost} moedas`
      : `Requer ${obrasText(plot.unlock)}`;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${plot.name}. ${status}.`}
      style={({ pressed }) => [
        styles.card,
        done && styles.cardDone,
        !done && !available && styles.cardLocked,
        pressed && { opacity: 0.75 },
      ]}
    >
      <View style={[styles.thumb, !done && styles.thumbGhost]}>
        <BuildingPreview type={plot.type} style={built[plot.id]?.style ?? 0} size={58} tight />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {plot.name}
      </Text>
      {done ? (
        <Text style={[styles.status, { color: colors.green600 }]}>✓ Concluída</Text>
      ) : available ? (
        <View style={styles.costPill}>
          <Text style={styles.costTxt}>● {plot.cost}</Text>
        </View>
      ) : (
        <Text style={styles.status}>🔒 {obrasText(plot.unlock)}</Text>
      )}
    </Pressable>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  c: { gap: spacing.md },
  zone: { gap: spacing.sm },
  zoneHead: { flexDirection: 'row', justifyContent: 'space-between' },
  zoneTitle: { fontSize: fs(13), fontWeight: '700', color: colors.navy, textTransform: 'uppercase' },
  zoneCount: { fontSize: fs(13), fontWeight: '600', color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: {
    flexBasis: '31%',
    flexGrow: 1,
    minHeight: 132,
    padding: spacing.sm,
    gap: 4,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  cardDone: { backgroundColor: colors.greenSoft, borderColor: colors.greenSoft },
  cardLocked: { opacity: 0.6 },
  thumb: { height: 64, justifyContent: 'center', overflow: 'hidden' },
  thumbGhost: { opacity: 0.45 },
  name: { fontSize: fs(12.5), fontWeight: '600', color: colors.ink, textAlign: 'center' },
  status: { fontSize: fs(12), color: colors.muted, fontWeight: '600' },
  costPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.gold,
  },
  costTxt: { fontSize: fs(12), fontWeight: '700', color: colors.goldInk },
});
