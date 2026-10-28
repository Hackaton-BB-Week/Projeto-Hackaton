import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme/tokens';

// Opção de resposta com "radio" (espelha .opt do protótipo).
export function OptionButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={[styles.opt, selected && styles.optSel]}
    >
      <View style={[styles.radio, selected && styles.radioSel]}>
        {selected && <View style={styles.dot} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  optSel: { borderColor: colors.blue, backgroundColor: '#eef3fd' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSel: { borderColor: colors.blue },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue },
  label: { flex: 1, fontSize: 14.5, fontWeight: '500', color: colors.ink },
});
