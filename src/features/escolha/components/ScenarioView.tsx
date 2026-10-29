import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Eyebrow } from '@/components/Eyebrow';
import { useTheme } from '@/theme/useTheme';
import type { Scenario } from '../scenarios';

type Props = {
  index: number;
  total: number;
  scenario: Scenario;
  picked: number | null;
  lastGain: number;
  onChoose: (i: number) => void;
  onNext: () => void;
};

export function ScenarioView({ index, total, scenario, picked, lastGain, onChoose, onNext }: Props) {
  const { colors, fs } = useTheme();
  const answered = picked !== null;
  const option = answered ? scenario.options[picked] : null;
  const good = option?.protective ?? false;
  const tone = good ? colors.green600 : colors.danger;
  const alternatives = scenario.options.filter((o) => o.protective);

  return (
    <View style={styles.wrap}>
      <View
        style={[styles.bar, { backgroundColor: colors.surface2 }]}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Cenário ${index + 1} de ${total}`}
        accessibilityValue={{ min: 0, max: total, now: index }}
      >
        <View
          style={[
            styles.fill,
            { width: `${((index + (answered ? 1 : 0)) / total) * 100}%`, backgroundColor: colors.gold },
          ]}
        />
      </View>
      <Text style={[styles.count, { color: colors.muted, fontSize: fs(12.5) }]}>
        Cenário {index + 1} de {total}
      </Text>

      <Card>
        <Text style={[styles.situation, { color: colors.ink, fontSize: fs(16) }]} accessibilityRole="header">
          {scenario.situation}
        </Text>
      </Card>

      <View style={styles.options} accessibilityRole="radiogroup">
        {scenario.options.map((o, i) => {
          const chosen = picked === i;
          const dim = answered && !chosen;
          return (
            <Pressable
              key={o.text}
              onPress={() => onChoose(i)}
              disabled={answered}
              accessibilityRole="radio"
              accessibilityState={{ checked: chosen, disabled: answered }}
              accessibilityLabel={o.text}
              style={({ pressed }) => [
                styles.opt,
                {
                  backgroundColor: chosen ? colors.brandSoft : colors.surface,
                  borderColor: chosen || (pressed && !answered) ? colors.brand : colors.line,
                },
                dim && styles.dim,
              ]}
            >
              <View style={[styles.radio, { borderColor: chosen ? colors.brand : colors.inputBorder }]}>
                {chosen && <View style={[styles.dot, { backgroundColor: colors.brand }]} />}
              </View>
              <Text style={[styles.optTxt, { color: colors.ink, fontSize: fs(14.5) }]}>{o.text}</Text>
            </Pressable>
          );
        })}
      </View>

      {option && (
        <View style={styles.wrap} accessibilityLiveRegion="polite">
          <Card style={[styles.gap, { borderColor: tone, backgroundColor: colors.surface }]}>
            <View style={styles.headRow}>
              <Feather name={good ? 'check-circle' : 'alert-triangle'} size={20} color={tone} />
              <Text style={[styles.head, { color: tone, fontSize: fs(16) }]} accessibilityRole="header">
                {good ? 'Boa escolha' : 'Vale repensar'}
              </Text>
            </View>
            <Text style={[styles.p, { color: colors.ink, fontSize: fs(14) }]}>{option.feedback}</Text>
            {lastGain > 0 && (
              <View style={[styles.chip, { backgroundColor: colors.surface2 }]}>
                <Feather name="disc" size={13} color={colors.gold} />
                <Text style={[styles.chipTxt, { color: colors.ink, fontSize: fs(12) }]}>
                  +{lastGain} moedas
                </Text>
              </View>
            )}
            {!good && (
              <View style={styles.gapSm}>
                <Text style={[styles.altTitle, { color: colors.ink, fontSize: fs(13) }]}>
                  Escolhas que protegem você aqui:
                </Text>
                {alternatives.map((a) => (
                  <View key={a.text} style={styles.altRow}>
                    <Feather name="check" size={15} color={colors.green600} />
                    <Text style={[styles.alt, { color: colors.ink, fontSize: fs(13.5) }]}>{a.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Card style={[styles.gap, { backgroundColor: colors.brandSoft, borderColor: colors.brand }]}>
            <Eyebrow>{`Entenda: ${scenario.learn.title}`}</Eyebrow>
            <Text style={[styles.p, { color: colors.ink, fontSize: fs(14) }]}>{scenario.learn.text}</Text>
          </Card>

          <Button
            label={index + 1 < total ? 'Próximo cenário' : 'Ver resumo'}
            icon="arrow-right"
            onPress={onNext}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  bar: { height: 8, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  count: { fontWeight: '700' },
  situation: { fontWeight: '700', lineHeight: 23 },
  options: { gap: 9 },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderRadius: 14,
  },
  dim: { opacity: 0.55 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  optTxt: { flex: 1, fontWeight: '500' },
  gap: { gap: 10 },
  gapSm: { gap: 6 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  head: { fontWeight: '700' },
  p: { lineHeight: 21 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  chipTxt: { fontWeight: '700' },
  altTitle: { fontWeight: '700' },
  altRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  alt: { flex: 1, lineHeight: 19 },
});
