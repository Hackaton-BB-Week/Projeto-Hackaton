import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { radius, spacing } from '@/theme/tokens';
import type { Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatBRL } from '@/lib/format';
import { useFinance } from '../useFinance';

// Atalho autocontido para a Home: basta colocar <FinanceShortcut /> na tela.
export function FinanceShortcut() {
  const styles = useThemedStyles(makeStyles);
  const { notBet } = useFinance();
  return (
    <Pressable
      onPress={() => router.push('/financeiro')}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Painel financeiro. ${formatBRL(notBet)} deixou de ir para apostas, estimativa.`}
      accessibilityHint="Abre o painel financeiro"
    >
      <View style={styles.flex}>
        <Text style={styles.t}>Painel financeiro</Text>
        <Text style={styles.d}>
          {formatBRL(notBet)} deixou de ir para apostas (estimativa)
        </Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
  },
  pressed: { opacity: 0.85 },
  flex: { flex: 1 },
  t: { fontSize: fs(15), fontWeight: '700', color: colors.ink },
  d: { fontSize: fs(12), color: colors.muted, marginTop: 2 },
  chev: { fontSize: fs(24), color: colors.brand, fontWeight: '600' },
});
