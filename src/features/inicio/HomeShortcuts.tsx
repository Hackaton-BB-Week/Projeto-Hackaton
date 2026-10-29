import type { ComponentProps } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, type Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

// Missões e Ajuda lado a lado, abaixo dos botões de registro (como no protótipo).
export function HomeShortcuts() {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Shortcut
        label="Missões"
        icon="target"
        iconColor={colors.brand}
        href="/missoes"
        hint="Abre as missões do dia"
      />
      <Shortcut
        label="Ajuda"
        icon="life-buoy"
        iconColor={colors.danger}
        href="/ajuda"
        hint="Abre os canais de ajuda e a respiração guiada"
      />
    </View>
  );
}

type Props = {
  label: string;
  icon: ComponentProps<typeof Feather>['name'];
  iconColor: string;
  href: Href;
  hint: string;
};

function Shortcut({ label, icon, iconColor, href, hint }: Props) {
  const { colors, fs } = useTheme();
  return (
    <Pressable
      onPress={() => router.navigate(href)}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: colors.surface, borderColor: colors.line, shadowColor: colors.shadow },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
    >
      <Feather name={icon} size={18} color={iconColor} />
      <Text style={[styles.txt, { color: colors.ink, fontSize: fs(14) }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  pressed: { opacity: 0.85 },
  txt: { fontWeight: '700' },
});
