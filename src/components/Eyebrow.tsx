import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/useTheme';

/** Rótulo curto de seção com o tracinho dourado do protótipo. */
export function Eyebrow({ children }: { children: string }) {
  const { colors, fs } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.bar, { backgroundColor: colors.gold }]} />
      <Text
        style={[styles.txt, { color: colors.ink, fontSize: fs(13) }]}
        accessibilityRole="header"
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bar: { width: 16, height: 3, borderRadius: 2 },
  txt: { fontWeight: '700' },
});
