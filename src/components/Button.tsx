import { useState, type ComponentProps } from 'react';
import { Pressable, Text, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

export type ButtonVariant =
  | 'primary'
  | 'success'
  | 'outline'
  | 'navy'
  | 'ghost'
  | 'soft'
  | 'danger';

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
  /** Troca só a cor do texto e do ícone (ex.: vermelho na recaída). */
  labelColor?: string;
};

const RADIUS = 14;
const BORDER = 1.5;

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
  labelColor,
}: Props) {
  const { colors, fs } = useTheme();

  const look = {
    primary: { bg: colors.gold, fg: colors.goldInk, border: 'transparent' },
    // Conclusão e acerto (ex.: registrar dia): verde, texto branco.
    success: { bg: colors.success, fg: '#ffffff', border: 'transparent' },
    outline: { bg: colors.surface, fg: colors.ink, border: colors.line },
    navy: { bg: colors.navy, fg: '#ffffff', border: 'transparent' },
    ghost: { bg: 'transparent', fg: colors.brand, border: 'transparent' },
    soft: { bg: colors.dangerSoft, fg: colors.danger, border: 'transparent' },
    // Recaída: fundo claro com texto e borda avermelhados (como no protótipo).
    danger: { bg: colors.surface, fg: colors.danger, border: colors.danger },
  }[variant];
  // Variantes com degradê: [topo, base].
  const gradient =
    variant === 'primary'
      ? [colors.gold2, colors.gold]
      : variant === 'success'
        ? [colors.success2, colors.success]
        : null;
  const primary = gradient !== null;
  // Tamanho real do botão (com a borda), para o degradê cobrir tudo, sem sobras.
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      onLayout={
        primary
          ? (e) => {
              const { width: w, height: h } = e.nativeEvent.layout;
              setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }));
            }
          : undefined
      }
      style={({ pressed }) => [
        styles.base,
        small ? styles.small : styles.full,
        { backgroundColor: look.bg, borderColor: look.border },
        primary && [styles.glow, { shadowColor: gradient[1] }],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {primary && size && (
        // Degradê (amarelo do protótipo ou verde de conclusão). Recua a largura da
        // borda para cobrir o botão inteiro, com o mesmo arredondamento.
        <Svg
          width={size.w}
          height={size.h}
          style={styles.gradient}
          pointerEvents="none"
        >
          <Defs>
            <LinearGradient id={`btn-${variant}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={gradient[0]} />
              <Stop offset="1" stopColor={gradient[1]} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={size.w} height={size.h} rx={RADIUS} ry={RADIUS} fill={`url(#btn-${variant})`} />
        </Svg>
      )}
      <View style={styles.row}>
        {icon && <Feather name={icon} size={small ? 16 : 18} color={labelColor ?? look.fg} />}
        <Text style={[styles.label, { color: labelColor ?? look.fg, fontSize: fs(small ? 13 : 15) }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: RADIUS,
    borderWidth: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  full: { alignSelf: 'stretch', paddingVertical: 13, paddingHorizontal: 18 },
  small: { alignSelf: 'flex-start', minHeight: 44, paddingVertical: 8, paddingHorizontal: 14 },
  // Brilho dourado embaixo do botão amarelo.
  glow: { shadowOpacity: 0.45, shadowRadius: 9, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  gradient: { position: 'absolute', top: -BORDER, left: -BORDER },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  label: { fontWeight: '700', textAlign: 'center' },
  pressed: { opacity: 0.85, transform: [{ translateY: 1 }] },
  disabled: { opacity: 0.5 },
});
