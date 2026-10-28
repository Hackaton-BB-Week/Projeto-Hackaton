import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, radius, spacing } from '@/theme/tokens';
import { formatBRL } from '@/lib/format';
import { useFinance } from './useFinance';
import { FinanceStat } from './components/FinanceStat';
import { ComparisonBars } from './components/ComparisonBars';
import { GoalProgress } from './components/GoalProgress';
import { FinanceForm } from './components/FinanceForm';

// Painel financeiro: o que as apostas custavam e para onde esse dinheiro pode ir.
export function FinanceScreen() {
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
            estimativa, com base no que você informa — sem promessa de ganho.
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
              color={colors.blue}
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

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.sky },
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
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTxt: { fontSize: 26, lineHeight: 28, color: colors.ink, fontWeight: '600' },
  h: { fontSize: 17, fontWeight: '700', color: colors.ink, flex: 1 },
  body: { padding: 18, paddingBottom: 32, gap: 14 },
  lead: { fontSize: 14, lineHeight: 21, color: colors.muted },
  statRow: { flexDirection: 'row', gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  eyebrow: { fontSize: 13, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
});
