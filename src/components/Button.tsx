import type { ComponentProps } from 'react';
import { Pressable, Text, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

export type ButtonVariant = 'primary' | 'outline' | 'navy' | 'ghost' | 'soft';

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: ComponentProps<typeof Feather>['name'];
  /** Botão compacto (largura do conteúdo). Mantém a altura mínima de 44px. */
  small?: boolean;
  disabled?: boolean;
  /** Texto lido pelo leitor de tela, se diferente do rótulo visível. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  small,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  style,
}: Props) {
  const { colors, fs } = useTheme();

  const look = {
    primary: { bg: colors.gold, fg: colors.goldInk, border: 'transparent' },
    outline: { bg: colors.surface, fg: colors.ink, border: colors.line },
    navy: { bg: colors.navy, fg: '#ffffff', border: 'transparent' },
    ghost: { bg: 'transparent', fg: colors.brand, border: 'transparent' },
    soft: { bg: colors.dangerSoft, fg: colors.danger, border: 'transparent' },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        small ? styles.small : styles.full,
        { backgroundColor: look.bg, borderColor: look.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon && <Feather name={icon} size={small ? 16 : 18} color={look.fg} />}
        <Text style={[styles.label, { color: look.fg, fontSize: fs(small ? 13 : 15) }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  full: { alignSelf: 'stretch', paddingVertical: 13, paddingHorizontal: 18 },
  small: { alignSelf: 'flex-start', minHeight: 44, paddingVertical: 8, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  label: { fontWeight: '700', textAlign: 'center' },
  pressed: { opacity: 0.85, transform: [{ translateY: 1 }] },
  disabled: { opacity: 0.5 },
});
