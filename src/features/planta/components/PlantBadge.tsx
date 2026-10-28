import { Pressable, View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { usePlant, usePlantUi } from '../usePlant';
import { PlantArt } from './PlantArt';

const AMBER = '#bb6a1e';

// Bolinha da planta no canto superior direito do mapa. Toque abre o painel.
export function PlantBadge() {
  const { colors, reduceMotion } = useTheme();
  const p = usePlant();
  const open = usePlantUi((s) => s.open);

  return (
    <Pressable
      onPress={() => open('plant')}
      accessibilityRole="button"
      accessibilityLabel={`Sua planta: ${p.wither ? 'precisando de cuidado' : `${p.stageName}, saudável`}`}
      accessibilityHint="Abre as informações da planta"
      hitSlop={6}
      style={[styles.badge, { backgroundColor: colors.surface, borderColor: colors.surface, shadowColor: colors.shadow }]}
    >
      <PlantArt stage={p.stage} wither={p.wither} size={50} animate={!reduceMotion} />
      <View
        style={[
          styles.dot,
          { backgroundColor: p.wither ? AMBER : colors.green600, borderColor: colors.surface },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
  },
});
