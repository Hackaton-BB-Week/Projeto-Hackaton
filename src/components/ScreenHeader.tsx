import type { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

type Props = {
  title: string;
  /** Padrão: volta para a tela anterior (ou para as abas, se não houver). */
  onBack?: () => void;
  backLabel?: string;
  right?: ReactNode;
};

/** Cabeçalho de telas fora das abas: voltar, título e um espaço opcional à direita. */
export function ScreenHeader({ title, onBack, backLabel = 'Voltar', right }: Props) {
  const { colors, fs } = useTheme();
  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/(tabs)')));

  return (
    <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <Pressable
        onPress={goBack}
        style={[styles.back, { backgroundColor: colors.surface2 }]}
        accessibilityRole="button"
        accessibilityLabel={backLabel}
      >
        <Feather name="chevron-left" size={22} color={colors.ink} />
      </Pressable>
      <Text style={[styles.h, { color: colors.ink, fontSize: fs(17) }]} accessibilityRole="header">
        {title}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  back: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  h: { flex: 1, fontWeight: '700' },
});
