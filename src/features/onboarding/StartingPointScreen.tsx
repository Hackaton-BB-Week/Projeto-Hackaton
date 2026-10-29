import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing } from '@/theme/tokens';
import type { Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatBRL } from '@/lib/format';
import { useSurveyStore } from './useSurveyStore';
import { useOnboarding } from './useOnboarding';
import { computeStartingPoint } from './profile';
import { OnboardingButton } from './components/OnboardingButton';

// "Seu ponto de partida": estimativas + mensagem acolhedora. Visual de #obProfile.
export function StartingPointScreen() {
  const styles = useThemedStyles(makeStyles);
  const answers = useSurveyStore((s) => s.answers);
  const { finishOnboarding } = useOnboarding();
  const sp = useMemo(() => computeStartingPoint(answers), [answers]);

  // Divide a mensagem para destacar o trecho entre ** **.
  const parts = sp.message.split('**');

  return (
    <SafeAreaView style={styles.c} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.body}>
        <View>
          <Text style={styles.h1} accessibilityRole="header">
            Seu ponto de partida
          </Text>
          <Text style={styles.lead}>Isto é uma referência, não um rótulo.</Text>
        </View>

        <View
          style={styles.profile}
          accessible
          accessibilityLabel={`Estimativa semanal: ${formatBRL(sp.weekly)}. Por mês: ${formatBRL(sp.monthly)}. Em um ano: ${formatBRL(sp.yearly)}.`}
        >
          <View style={styles.chip}>
            <Text style={styles.chipTxt}>Estimativa semanal</Text>
          </View>
          <Text style={styles.est}>{formatBRL(sp.weekly)}</Text>
          <Text style={styles.estSub}>com base no que você compartilhou</Text>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statV}>{formatBRL(sp.monthly)}</Text>
              <Text style={styles.statL}>por mês (estimativa)</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statV}>{formatBRL(sp.yearly)}</Text>
              <Text style={styles.statL}>em um ano (estimativa)</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.reflect}>
            {parts.map((p, i) =>
              i % 2 === 1 ? (
                <Text key={i} style={styles.bold}>
                  {p}
                </Text>
              ) : (
                p
              ),
            )}
          </Text>
        </View>

        <Text style={styles.disclaimer}>
          Esses valores são aproximações feitas a partir das suas respostas, só pra servir de
          referência. Nada aqui é avaliação clínica ou diagnóstico.
        </Text>

        <OnboardingButton label="Ver minha vila" onPress={() => finishOnboarding(sp)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.lg, gap: 16 },
  h1: { fontSize: fs(25), fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  lead: { fontSize: fs(14), color: colors.muted, marginTop: 6, lineHeight: fs(21) },
  // Azul que segura o texto branco nos dois modos (o brand do escuro é claro demais).
  profile: { backgroundColor: colors.feature, borderRadius: radius.lg, padding: spacing.md },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  chipTxt: { color: '#fff', fontSize: fs(12), fontWeight: '600' },
  est: { color: '#fff', fontSize: fs(36), fontWeight: '800', marginTop: 8, marginBottom: 2, letterSpacing: -1 },
  estSub: { color: '#c6d7f6', fontSize: fs(12) },
  statRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 13 },
  statV: { fontSize: fs(19), fontWeight: '700', color: colors.ink },
  statL: { fontSize: fs(11.5), color: colors.muted, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  reflect: { fontSize: fs(14.5), lineHeight: fs(23), color: colors.ink },
  bold: { fontWeight: '700', color: colors.brand700 },
  disclaimer: { fontSize: fs(12), color: colors.faint, lineHeight: fs(18) },
});
