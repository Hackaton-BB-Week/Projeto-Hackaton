import { useRef, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useTheme } from '@/theme/useTheme';
import { usePreJogo } from './usePreJogo';
import { QuestionStep } from './components/QuestionStep';
import { ResultView } from './components/ResultView';

// Modo pré-jogo: 4 perguntas para pausar antes de apostar e um plano personalizado.
export function PreJogoScreen() {
  const { colors } = useTheme();
  const { step, total, current, selected, result, choose, back, restart } = usePreJogo();
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [step]);

  return (
    <SafeAreaView style={[styles.c, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <ScreenHeader
        title="Modo pré-jogo"
        // Durante as perguntas, "voltar" volta uma pergunta; na primeira, sai da tela.
        onBack={current && step > 0 ? back : undefined}
        backLabel={current && step > 0 ? 'Pergunta anterior' : 'Voltar'}
      />
      <ScrollView ref={scroll} contentContainerStyle={styles.body}>
        {current ? (
          <QuestionStep
            step={step}
            total={total}
            question={current.question}
            options={current.options}
            selected={selected}
            onChoose={(id) => choose(current.key, id)}
          />
        ) : (
          result && <ResultView result={result} onRestart={restart} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1 },
  body: { padding: 18, paddingBottom: 32 },
});
