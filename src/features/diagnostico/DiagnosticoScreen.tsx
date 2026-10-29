import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { QuestionStep } from '@/components/QuestionStep';
import { useTheme } from '@/theme/useTheme';
import { useDiagnostico } from './useDiagnostico';
import { DiagnosisResult } from './components/DiagnosisResult';

// Refazer diagnóstico: 6 perguntas e um novo ponto de partida (gatilho + gasto semanal).
export function DiagnosticoScreen() {
  const { colors, fs } = useTheme();
  const d = useDiagnostico();
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [d.step]);

  const inQuestions = d.current !== null;
  return (
    <SafeAreaView style={[styles.c, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <ScreenHeader
        title="Diagnóstico"
        // Nas perguntas, "voltar" volta uma pergunta; na primeira, sai da tela.
        onBack={inQuestions && d.step > 0 ? d.back : undefined}
        backLabel={inQuestions && d.step > 0 ? 'Pergunta anterior' : 'Voltar'}
      />
      <ScrollView ref={scroll} contentContainerStyle={styles.body}>
        {d.current ? (
          <>
            {d.step === 0 && (
              <Text style={[styles.lead, { color: colors.muted, fontSize: fs(14) }]}>
                Responda pensando nas últimas semanas. Isto é uma referência para você, não um
                rótulo.
              </Text>
            )}
            <QuestionStep
              step={d.step}
              total={d.total}
              question={d.current.question}
              options={d.current.options}
              selected={d.selectedId}
              onChoose={d.choose}
            />
          </>
        ) : (
          d.result && <DiagnosisResult result={d.result} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1 },
  body: { padding: 18, paddingBottom: 32, gap: 14 },
  lead: { lineHeight: 21 },
});
