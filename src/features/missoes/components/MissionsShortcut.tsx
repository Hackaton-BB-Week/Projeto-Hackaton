import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';
import { useDailyMissions } from '../useDailyMissions';

// Atalho autocontido para a Home: basta colocar <MissionsShortcut /> na tela.
export function MissionsShortcut() {
  const { colors, fs } = useTheme();
  const { doneCount, total } = useDailyMissions();
  const allDone = doneCount === total;

  return (
    <Pressable
      onPress={() => router.push('/missoes')}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.line },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Missões do dia. ${doneCount} de ${total} concluídas.`}
      accessibilityHint="Abre as missões do dia"
    >
      <View style={[styles.icon, { backgroundColor: colors.brandSoft }]}>
        <Feather name="target" size={20} color={colors.brand} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.t, { color: colors.ink, fontSize: fs(15) }]}>Missões do dia</Text>
        <Text style={[styles.d, { color: colors.muted, fontSize: fs(12) }]}>
          {allDone ? 'Tudo feito por hoje 💛' : `${doneCount} de ${total} concluídas · ganhe moedas`}
        </Text>
      </View>
      <Feather name="chevron-right" size={22} color={colors.brand} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },
  pressed: { opacity: 0.85 },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  t: { fontWeight: '700' },
  d: { marginTop: 2 },
});
