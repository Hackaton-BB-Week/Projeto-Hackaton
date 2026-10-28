import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { MenuButton } from '@/features/menu/MenuButton';
import { useUserStore } from '@/store/useUserStore';
import { useProfile } from '@/hooks/useProfile';
import { useGameStore } from '@/store/useGameStore';
import { formatBRL, formatCoins } from '@/lib/format';
import { useTheme } from '@/theme/useTheme';

/** 1.2 → "1,2" */
const fmtMult = (m: number) => String(m).replace('.', ',');

// Topo da tela Início (HUD do protótipo): menu, saudação, multiplicador, moedas
// e os quadros de sequência, dias no total e dinheiro preservado.
export function HomeHud() {
  const { colors, fs } = useTheme();
  const name = useUserStore((s) => s.name);
  const { coins, preserved, multiplier } = useProfile();
  const { streak, total } = useGameStore();
  const first = name.trim().split(' ')[0];

  return (
    <View style={[styles.hud, { backgroundColor: colors.bg }]}>
      <View style={styles.top}>
        <MenuButton />
        <Text
          style={[styles.greet, { color: colors.ink, fontSize: fs(18) }]}
          numberOfLines={1}
          accessibilityRole="header"
        >
          {first ? `Olá, ${first}` : 'Sua vila'}
        </Text>
        <Pill
          label={`Multiplicador da sequência: ${fmtMult(multiplier)} vezes`}
          icon={<Ionicons name="flame-outline" size={15} color={colors.green600} />}
          text={`×${fmtMult(multiplier)}`}
          color={colors.green600}
        />
        <Pill
          label={`${formatCoins(coins)} moedas`}
          icon={<MaterialCommunityIcons name="circle-multiple-outline" size={15} color={colors.gold} />}
          text={formatCoins(coins)}
          color={colors.ink}
        />
      </View>

      <View style={styles.stats}>
        <Stat
          icon={<Ionicons name="flame-outline" size={17} color={colors.brand} />}
          value={String(streak)}
          label="em sequência"
          a11y={`${streak} ${streak === 1 ? 'dia' : 'dias'} em sequência`}
        />
        <Stat
          icon={<Feather name="check" size={17} color={colors.brand} />}
          value={String(total)}
          label="dias no total"
          a11y={`${total} ${total === 1 ? 'dia' : 'dias'} sem apostar no total`}
        />
        <Stat
          icon={<MaterialCommunityIcons name="circle-multiple-outline" size={17} color={colors.brand} />}
          value={formatBRL(preserved)}
          label="preservado"
          a11y={`${formatBRL(preserved)} preservados, estimativa`}
        />
      </View>
    </View>
  );
}

function Pill({ icon, text, color, label }: { icon: ReactNode; text: string; color: string; label: string }) {
  const { colors, fs } = useTheme();
  return (
    <View
      style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.line, shadowColor: colors.shadow }]}
      accessible
      accessibilityLabel={label}
    >
      {icon}
      <Text style={[styles.pillTxt, { color, fontSize: fs(13) }]}>{text}</Text>
    </View>
  );
}

function Stat({ icon, value, label, a11y }: { icon: ReactNode; value: string; label: string; a11y: string }) {
  const { colors, fs } = useTheme();
  return (
    <View
      style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.line, shadowColor: colors.shadow }]}
      accessible
      accessibilityLabel={a11y}
    >
      <View style={[styles.statIcon, { backgroundColor: colors.brandSoft }]}>{icon}</View>
      <View style={styles.flex}>
        <Text style={[styles.statV, { color: colors.ink, fontSize: fs(16) }]} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        <Text style={[styles.statL, { color: colors.muted, fontSize: fs(10.5) }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const shadow = { shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 };

const styles = StyleSheet.create({
  hud: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  greet: { flex: 1, minWidth: 0, fontWeight: '700', letterSpacing: -0.3 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 11,
    ...shadow,
  },
  pillTxt: { fontWeight: '700', fontVariant: ['tabular-nums'] },
  stats: { flexDirection: 'row', gap: 8 },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 9,
    ...shadow,
  },
  statIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, minWidth: 0 },
  statV: { fontWeight: '700', fontVariant: ['tabular-nums'] },
  statL: { marginTop: 1 },
});
