import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme/useTheme';
import { usePlant, usePlantUi } from '../usePlant';

const AMBER = '#bb6a1e';

// Aviso da Home quando a planta está murcha (por recaída ou por um dia sem cuidado).
export function RecoveryBanner() {
  const { colors, fs } = useTheme();
  const p = usePlant();
  const open = usePlantUi((s) => s.open);
  if (!p.wither) return null;

  const text =
    p.witherReason === 'relapse'
      ? 'Uma recaída aconteceu — faça a missão de retomada para ajudá-la a se recuperar.'
      : 'Ela sentiu sua falta. Uma missão rapidinha ajuda ela a se recuperar.';

  return (
    <View
      style={[styles.c, { backgroundColor: colors.surface, borderColor: AMBER }]}
      accessibilityRole="summary"
    >
      <View style={styles.icon}>
        <Feather name="droplet" size={20} color={AMBER} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.h, { fontSize: fs(14.5) }]}>Sua planta precisa de cuidado</Text>
        <Text style={[styles.p, { color: colors.muted, fontSize: fs(12) }]}>{text}</Text>
      </View>
      <Button label="Retomar" small onPress={() => open('recovery')} />
    </View>
  );
}

const styles = StyleSheet.create({
  c: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(187,106,30,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  h: { fontWeight: '700', color: AMBER },
  p: { marginTop: 2, lineHeight: 17 },
});
