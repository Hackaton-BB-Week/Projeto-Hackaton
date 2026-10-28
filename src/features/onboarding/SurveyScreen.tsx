import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, radius, spacing } from '@/theme/tokens';
import { QUESTIONS } from './questions';
import { useSurveyStore } from './useSurveyStore';
import { OptionButton } from './components/OptionButton';
import { OnboardingButton } from './components/OnboardingButton';

// Pesquisa inicial: uma pergunta por vez, com progresso. Visual de #obSurvey.
export function SurveyScreen() {
  const { index, answers, answer, setIndex } = useSurveyStore();
  const q = QUESTIONS[index];
  const selected = answers[q.key];
  const isLast = index === QUESTIONS.length - 1;
  const progress = (index / (QUESTIONS.length - 1)) * 100;

  const back = () => {
    if (index > 0) setIndex(index - 1);
    else router.back();
  };

  const next = () => {
    if (selected === undefined) return;
    if (isLast) router.push('/onboarding/ponto-de-partida');
    else setIndex(index + 1);
  };

  return (
    <SafeAreaView style={styles.c} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Pressable
          onPress={back}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
        >
          <Text style={styles.backTxt}>‹</Text>
        </Pressable>
        <View
          style={styles.bar}
          accessibilityRole="progressbar"
          accessibilityLabel="Progresso da pesquisa"
          accessibilityValue={{ min: 1, max: QUESTIONS.length, now: index + 1 }}
        >
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.count}>
          {index + 1}/{QUESTIONS.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.h2} accessibilityRole="header">
          {q.title}
        </Text>
        <View style={styles.options} accessibilityRole="radiogroup">
          {q.options.map((o) => (
            <OptionButton
              key={String(o.value)}
              label={o.label}
              selected={selected === o.value}
              onPress={() => answer(q.key, o.value)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.foot}>
        <OnboardingButton
          variant="navy"
          label={isLast ? 'Ver meu ponto de partida' : 'Continuar'}
          onPress={next}
          disabled={selected === undefined}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.sky },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8 },
  back: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.sky2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTxt: { fontSize: 26, lineHeight: 28, color: colors.ink, fontWeight: '600' },
  bar: { flex: 1, height: 8, borderRadius: 999, backgroundColor: colors.sky2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: colors.gold },
  count: { minWidth: 34, textAlign: 'right', fontSize: 12.5, fontWeight: '700', color: colors.muted },
  body: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: spacing.md },
  h2: { fontSize: 23, fontWeight: '700', color: colors.ink, marginBottom: 16, lineHeight: 27 },
  options: { gap: 9 },
  foot: { paddingHorizontal: 18, paddingTop: spacing.md, paddingBottom: 18 },
});
