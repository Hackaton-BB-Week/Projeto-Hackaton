import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';

// Linha de configuração: título, descrição e o controle à direita.
// `large` deixa os textos maiores (usado em Acessibilidade).
export function SettingRow({
  title,
  description,
  children,
  first,
  large,
}: {
  title: string;
  description: string;
  children: ReactNode;
  first?: boolean;
  large?: boolean;
}) {
  const { colors, fs } = useTheme();
  return (
    <View style={[styles.row, !first && { borderTopWidth: 1, borderTopColor: colors.line }]}>
      <View style={styles.text}>
        <Text style={[styles.title, { color: colors.ink, fontSize: fs(large ? 17 : 15) }]}>
          {title}
        </Text>
        <Text
          style={[
            styles.desc,
            {
              color: colors.muted,
              fontSize: fs(large ? 14.5 : 12.5),
              lineHeight: fs(large ? 21 : 18),
            },
          ]}
        >
          {description}
        </Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  text: { flex: 1, gap: 3 },
  title: { fontWeight: '700' },
  desc: {},
});
