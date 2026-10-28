import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';
import { useMenuStore } from './useMenuStore';

/** Botão ☰ que abre o menu lateral. */
export function MenuButton() {
  const { colors } = useTheme();
  const openMenu = useMenuStore((s) => s.openMenu);
  return (
    <Pressable
      onPress={openMenu}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Abrir menu"
      accessibilityHint="Mostra as ferramentas de apoio e as configurações"
    >
      <Feather name="menu" size={21} color={colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  pressed: { opacity: 0.8 },
});
