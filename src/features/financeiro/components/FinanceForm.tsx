import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { radius, spacing } from '@/theme/tokens';
import { useTheme, type Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { parseMoneyInput } from '../finance';
import type { FinanceUpdate } from '../useFinance';

type FieldKey = keyof FinanceUpdate;

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: 'weeklySpend', label: 'Gasto habitual por semana (R$)' },
  { key: 'saved', label: 'Guardado de fato (R$)' },
  { key: 'losses', label: 'Perdas estimadas no período (R$)' },
  { key: 'goal', label: 'Meta financeira (R$)' },
];

const toText = (n: number) => (n > 0 ? String(n) : '');

// Formulário para o usuário atualizar os próprios valores. Campo vazio = 0.
export function FinanceForm({
  initial,
  onSave,
}: {
  initial: FinanceUpdate;
  onSave: (v: FinanceUpdate) => void;
}) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const [draft, setDraft] = useState<Record<FieldKey, string>>(() => ({
    weeklySpend: toText(initial.weeklySpend),
    saved: toText(initial.saved),
    losses: toText(initial.losses),
    goal: toText(initial.goal),
  }));
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (!savedMsg) return;
    const t = setTimeout(() => setSavedMsg(false), 2400);
    return () => clearTimeout(t);
  }, [savedMsg]);

  const submit = () => {
    const v = {} as FinanceUpdate;
    FIELDS.forEach(({ key }) => {
      v[key] = parseMoneyInput(draft[key]) ?? 0;
    });
    onSave(v);
    // Normaliza o que ficou nos campos (ex.: "R$ 50,90" vira "50").
    setDraft({
      weeklySpend: toText(v.weeklySpend),
      saved: toText(v.saved),
      losses: toText(v.losses),
      goal: toText(v.goal),
    });
    setSavedMsg(true);
  };

  return (
    <View>
      <Text style={styles.eyebrow} accessibilityRole="header">
        Atualizar valores
      </Text>
      {FIELDS.map(({ key, label }) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label} nativeID={`fin-${key}`}>
            {label}
          </Text>
          <TextInput
            style={styles.input}
            value={draft[key]}
            onChangeText={(t) => setDraft((d) => ({ ...d, [key]: t }))}
            keyboardType="number-pad"
            inputMode="numeric"
            placeholder="0"
            placeholderTextColor={colors.faint}
            accessibilityLabel={label}
            accessibilityLabelledBy={`fin-${key}`}
            returnKeyType="done"
          />
        </View>
      ))}
      <Pressable
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        onPress={submit}
        accessibilityRole="button"
        accessibilityLabel="Salvar valores"
      >
        <Text style={styles.btnTxt}>Salvar</Text>
      </Pressable>
      {savedMsg && (
        <Text style={styles.ok} accessibilityLiveRegion="polite" accessibilityRole="alert">
          Valores atualizados
        </Text>
      )}
    </View>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  eyebrow: { fontSize: fs(13), fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  field: { gap: 7, marginBottom: 14 },
  label: { fontSize: fs(13), fontWeight: '600', color: colors.ink },
  input: {
    fontSize: fs(15),
    paddingVertical: 13,
    paddingHorizontal: 14,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    color: colors.ink,
  },
  btn: {
    backgroundColor: colors.success,
    borderRadius: radius.md,
    paddingVertical: 15,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { opacity: 0.85 },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: fs(15) },
  ok: { textAlign: 'center', color: colors.green600, fontWeight: '600', marginTop: spacing.sm },
});
