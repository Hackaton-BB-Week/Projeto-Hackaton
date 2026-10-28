import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { useTheme, type Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';

// Campo com rótulo e mensagem de erro (espelha .field do protótipo).
export function TextField({
  label,
  error,
  ...input
}: TextInputProps & { label: string; error?: string | null }) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...input}
        accessibilityLabel={label}
        accessibilityHint={error ?? undefined}
        placeholderTextColor={colors.faint}
        onFocus={(e) => {
          setFocused(true);
          input.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          input.onBlur?.(e);
        }}
        style={[styles.input, focused && styles.focused, !!error && styles.invalid]}
      />
      <Text style={styles.err} accessibilityLiveRegion="polite">
        {error ?? ''}
      </Text>
    </View>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  field: { gap: 7, marginBottom: 6 },
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
  focused: { borderColor: colors.brand },
  invalid: { borderColor: colors.danger },
  err: { fontSize: fs(12), color: colors.danger, minHeight: 16 },
});
