import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { radius, spacing } from '@/theme/tokens';
import { useTheme, type Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatBRL } from '@/lib/format';
import { useFinance } from './useFinance';
import { FinanceStat } from './components/FinanceStat';
import { ComparisonBars } from './components/ComparisonBars';
import { GoalProgress } from './components/GoalProgress';
import { FinanceForm } from './components/FinanceForm';

// Painel financeiro: o que as apostas custavam e para onde esse dinheiro pode ir.
export function FinanceScreen() {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const f = useFinance();

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

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
          Painel financeiro
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.lead}>
            Acompanhe o que as apostas custavam e para onde esse dinheiro pode ir. Tudo é
            estimativa, com base no que você informa. Sem promessa de ganho.
          </Text>

          <View style={styles.statRow}>
            <FinanceStat
              value={formatBRL(f.notBet)}
              label={`deixou de apostar (estim., ${f.totalDays} ${f.totalDays === 1 ? 'dia' : 'dias'})`}
              color={colors.green600}
            />
            <FinanceStat
              value={formatBRL(f.saved)}
              label="guardado de fato (você informa)"
              color={colors.brand}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.eyebrow} accessibilityRole="header">
              Comparativo
            </Text>
            <ComparisonBars bars={f.bars} />
          </View>

          {f.goal > 0 && (
            <View style={styles.card}>
              <GoalProgress percent={f.goalPercent} />
            </View>
          )}

          <FinanceForm
            initial={{ weeklySpend: f.weeklySpend, saved: f.saved, losses: f.losses, goal: f.goal }}
            onSave={f.update}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
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
  statRow: { flexDirection: 'row', gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  eyebrow: { fontSize: fs(13), fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
});
