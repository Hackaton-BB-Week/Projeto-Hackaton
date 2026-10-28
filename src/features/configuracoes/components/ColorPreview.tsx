import { View, Text, StyleSheet } from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { tintFor } from '@/theme/colorblind';
import { useTheme } from '@/theme/useTheme';

// Amostras de cor do "Modo para daltonismo": mudam na hora ao ligar/desligar,
// para a pessoa ver a diferença. Cada bloco tem nome (não depende só da cor).
export function ColorPreview() {
  const { colors, fs } = useTheme();
  const tint = tintFor(useSettingsStore((s) => s.colorblind));

  const samples = [
    { label: 'Sucesso', color: colors.green600 },
    { label: 'Alerta', color: colors.danger },
    { label: 'Telhado verde', color: tint('#5ec16f') },
    { label: 'Telhado vermelho', color: tint('#ff6b5e') },
    { label: 'Árvores', color: tint('#54b838') },
    { label: 'Grama', color: tint('#7ec84e') },
  ];

  return (
    <View
      style={styles.c}
      accessible
      accessibilityLabel="Amostras de cor. Mudam quando o modo para daltonismo é ligado."
    >
      {samples.map((s) => (
        <View key={s.label} style={styles.item}>
          <View style={[styles.block, { backgroundColor: s.color, borderColor: colors.line }]} />
          <Text style={[styles.label, { color: colors.muted, fontSize: fs(12) }]} numberOfLines={2}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 14 },
  item: { width: '30%', flexGrow: 1, alignItems: 'center', gap: 5 },
  block: { width: '100%', height: 34, borderRadius: 10, borderWidth: 1 },
  label: { textAlign: 'center', fontWeight: '600' },
});
