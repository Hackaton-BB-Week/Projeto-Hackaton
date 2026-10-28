import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme/tokens';

type Variant = 'primary' | 'navy' | 'ghost';

// Botões do onboarding (primary = amarelo, navy = azul escuro, ghost = só texto).
export function OnboardingButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.txt, styles[`${variant}Txt`]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.gold },
  navy: { backgroundColor: colors.navy },
  ghost: { backgroundColor: 'transparent', paddingVertical: 12 },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  txt: { fontSize: 15, fontWeight: '700' },
  primaryTxt: { color: colors.goldInk },
  navyTxt: { color: '#fff' },
  ghostTxt: { color: colors.blue, fontWeight: '600' },
});
