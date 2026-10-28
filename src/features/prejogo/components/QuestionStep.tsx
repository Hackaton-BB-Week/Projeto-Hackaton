import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';

type Props = {
  step: number;
  total: number;
  question: string;
  options: readonly { id: string; label: string }[];
  selected?: string;
  onChoose: (id: string) => void;
};

/** Uma pergunta do pré-jogo: barra de progresso + opções (tocar já avança). */
export function QuestionStep({ step, total, question, options, selected, onChoose }: Props) {
  const { colors, fs } = useTheme();
  const pct = (step / total) * 100;

  return (
    <View style={styles.wrap}>
      <View
        style={[styles.bar, { backgroundColor: colors.surface2 }]}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Pergunta ${step + 1} de ${total}`}
        accessibilityValue={{ min: 0, max: total, now: step }}
      >
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: colors.gold }]} />
      </View>
      <Text style={[styles.count, { color: colors.muted, fontSize: fs(12.5) }]}>
        {step + 1} de {total}
      </Text>
      <Text style={[styles.q, { color: colors.ink, fontSize: fs(21) }]} accessibilityRole="header">
        {question}
      </Text>
      <View style={styles.options} accessibilityRole="radiogroup">
        {options.map((o) => {
          const sel = o.id === selected;
          return (
            <Pressable
              key={o.id}
              onPress={() => onChoose(o.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: sel }}
              accessibilityLabel={o.label}
              style={({ pressed }) => [
                styles.opt,
                {
                  backgroundColor: sel ? colors.brandSoft : colors.surface,
                  borderColor: sel || pressed ? colors.brand : colors.line,
                },
              ]}
            >
              <View style={[styles.radio, { borderColor: sel ? colors.brand : colors.line }]}>
                {sel && <View style={[styles.dot, { backgroundColor: colors.brand }]} />}
              </View>
              <Text style={[styles.optTxt, { color: colors.ink, fontSize: fs(14.5) }]}>
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  bar: { height: 8, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  count: { fontWeight: '700' },
  q: { fontWeight: '700', lineHeight: 27 },
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
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  optTxt: { flex: 1, fontWeight: '500' },
});
