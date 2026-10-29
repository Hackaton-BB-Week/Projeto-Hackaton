import { View, Text, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { radius, spacing } from '@/theme/tokens';
import { useTheme, type Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatBRL } from '@/lib/format';
import { CDB_PERCENT_CDI, useInvestments } from './useInvestments';
import { GrowthChart } from './components/GrowthChart';
import type { Simulation } from './investment';

const pct = (n: number, digits = 2) => `${n.toFixed(digits).replace('.', ',')}%`;

// Investimentos: e se o dinheiro das apostas tivesse ido para a renda fixa?
export function InvestmentScreen() {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const inv = useInvestments();

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/financeiro'));

  return (
    <SafeAreaView style={styles.c} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={goBack}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
        >
          <Text style={styles.backTxt}>‹</Text>
        </Pressable>
        <Text style={styles.h} accessibilityRole="header">
          Investimentos
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.lead}>
          E se você aplicasse hoje o que já deixou de apostar e, todo mês, colocasse lá o que iria
          para as apostas? Veja uma estimativa para os próximos 12 meses.
        </Text>

        {inv.weeklySpend <= 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Falta um dado</Text>
            <Text style={styles.note}>
              Informe quanto costumava gastar por semana no Painel financeiro para ver a simulação.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.pill}>
              <Text style={styles.pillTxt}>
                Aplica hoje: <Text style={styles.strong}>{formatBRL(inv.initial)}</Text>
                {'\n'}Aporte mensal: <Text style={styles.strong}>{formatBRL(inv.monthly)}</Text>
                {'  '}({formatBRL(inv.weeklySpend)}/semana)
              </Text>
            </View>

            {inv.loading && <ActivityIndicator color={colors.brand} />}

            <ProductCard
              title={`CDB Banco do Brasil · ${CDB_PERCENT_CDI}% do CDI`}
              index="CDI"
              sim={inv.cdb}
              color={colors.green}
            />
            <ProductCard title="Tesouro Selic" index="Selic" sim={inv.tesouro} color={colors.brand} />
          </>
        )}

        <Text style={styles.foot}>
          {inv.source === 'bcb'
            ? 'Taxas: Banco Central do Brasil (Selic e CDI mensais dos últimos 12 meses). '
            : 'Sem conexão com o Banco Central: usando taxas de referência embutidas. '}
          A estimativa usa a taxa do último mês para os próximos 12. Valores brutos, sem imposto de renda nem taxas.
          É uma simulação educativa, não uma recomendação nem promessa de rendimento.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductCard({
  title,
  index,
  sim,
  color,
}: {
  title: string;
  index: string;
  sim: Simulation;
  color: string;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.note}>
        {index} acumulado em 12 meses: {pct(sim.rate12m)} · estimativa a {pct(sim.projectionRate)} ao mês
      </Text>

      <View
        accessible
        accessibilityLabel={`${title}. Aplicando ${formatBRL(sim.initial)} hoje e aportando todo mês, em 12 meses você teria cerca de ${formatBRL(sim.in12)}, tendo aportado ${formatBRL(sim.investedIn12)}.`}
      >
        <GrowthChart points={sim.points} color={color} />
      </View>

      <View style={styles.stats}>
        <Stat label="você aporta em 12 meses" value={sim.investedIn12} />
        <Stat
          label="teria em 12 meses (estim.)"
          value={sim.in12}
          sub={`rendeu ${formatBRL(sim.in12 - sim.investedIn12)}`}
        />
      </View>
    </View>
  );
}

function Stat({ label, value, sub }: { label: string; value: number; sub?: string }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{formatBRL(value)}</Text>
      <Text style={styles.note}>{label}</Text>
      {sub && <Text style={styles.gain}>{sub}</Text>}
    </View>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
    c: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    back: {
      width: 44,
      height: 44,
      borderRadius: radius.sm,
      backgroundColor: colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backTxt: { fontSize: fs(26), lineHeight: fs(28), color: colors.ink, fontWeight: '600' },
    h: { fontSize: fs(17), fontWeight: '700', color: colors.ink, flex: 1 },
    body: { padding: 18, paddingBottom: 32, gap: 14 },
    lead: { fontSize: fs(14), lineHeight: fs(21), color: colors.muted },
    pill: {
      backgroundColor: colors.brandSoft,
      borderRadius: radius.md,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    pillTxt: { fontSize: fs(13), color: colors.ink },
    strong: { fontWeight: '700' },
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.lg,
      padding: spacing.md,
      gap: 8,
    },
    cardTitle: { fontSize: fs(15), fontWeight: '700', color: colors.ink },
    note: { fontSize: fs(12), lineHeight: fs(17), color: colors.muted },
    stats: { flexDirection: 'row', gap: 10, marginTop: 4 },
    stat: { flex: 1, backgroundColor: colors.bg, borderRadius: radius.md, padding: 10 },
    statVal: { fontSize: fs(18), fontWeight: '700', color: colors.ink, fontVariant: ['tabular-nums'] },
    gain: { fontSize: fs(12), color: colors.green600, fontWeight: '600', marginTop: 2 },
    foot: { fontSize: fs(11), lineHeight: fs(16), color: colors.faint },
  });
