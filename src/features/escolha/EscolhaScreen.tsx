import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useTheme } from '@/theme/useTheme';
import { useEscolha } from './useEscolha';
import { ScenarioView } from './components/ScenarioView';
import { SummaryView } from './components/SummaryView';

// "Aposta ou Escolha?": quiz educativo sobre situações reais das apostas.
export function EscolhaScreen() {
  const { colors, fs } = useTheme();
  const e = useEscolha();
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [e.index]);

  return (
    <SafeAreaView style={[styles.c, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <ScreenHeader title="Aposta ou Escolha?" />
      <ScrollView ref={scroll} contentContainerStyle={styles.body}>
        {e.scenario ? (
          <>
            {e.index === 0 && e.picked === null && (
              <Text style={[styles.lead, { color: colors.muted, fontSize: fs(14) }]}>
                Escolha como você reagiria. Depois, veja os riscos ou benefícios. É só
                educativo, sem apostas de verdade.
              </Text>
            )}
            <ScenarioView
              index={e.index}
              total={e.total}
              scenario={e.scenario}
              picked={e.picked}
              lastGain={e.lastGain}
              onChoose={e.choose}
              onNext={e.next}
            />
          </>
        ) : (
          <SummaryView
            protectiveCount={e.protectiveCount}
            total={e.total}
            earned={e.earned}
            onRestart={e.restart}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1 },
  body: { padding: 18, paddingBottom: 32, gap: 12 },
  lead: { lineHeight: 21 },
});
