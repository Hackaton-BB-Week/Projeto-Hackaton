import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme/useTheme';
import type { Mission } from '../missions';

type Props = { mission: Mission & { done: boolean }; onComplete: () => void };

export function MissionItem({ mission, onComplete }: Props) {
  const { colors, fs } = useTheme();
  const { done } = mission;
  const accent = done ? colors.green600 : colors.brand;

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: done ? colors.surface2 : colors.surface,
          borderColor: done ? colors.green600 : colors.line,
        },
      ]}
    >
      {/* Ícone decorativo: no Android o <Text> do ícone não se esconde sozinho do TalkBack. */}
      <View
        style={[styles.icon, { backgroundColor: colors.brandSoft }]}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <Feather name={mission.icon} size={20} color={accent} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.t, { color: colors.ink, fontSize: fs(14.5) }]}>{mission.title}</Text>
        <Text style={[styles.d, { color: colors.muted, fontSize: fs(12.5) }]}>
          {mission.description}
        </Text>
      </View>
      {done ? (
        <View
          style={styles.doneBadge}
          accessible
          accessibilityLabel={`${mission.title}: concluída hoje`}
        >
          <Feather name="check-circle" size={22} color={colors.green600} />
          <Text style={[styles.doneTxt, { color: colors.green600, fontSize: fs(11) }]}>Feita</Text>
        </View>
      ) : (
        <Button
          small
          label={`+${mission.reward}`}
          icon="check"
          onPress={onComplete}
          accessibilityLabel={`Concluir ${mission.title}`}
          accessibilityHint={`Marca como feita e adiciona ${mission.reward} moedas`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 2 },
  t: { fontWeight: '700' },
  d: { lineHeight: 17 },
  doneBadge: { alignItems: 'center', minWidth: 44, gap: 2 },
  doneTxt: { fontWeight: '700' },
});
