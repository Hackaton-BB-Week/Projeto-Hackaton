import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import { EMERGENCY_CHANNELS } from '../crisis';

// Cartão fixo com os canais de emergência. Aparece quando a mensagem tem sinal de crise.
export function CrisisCard({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.card} accessibilityRole="alert">
      <Text style={styles.title}>Você não está sozinho</Text>
      <Text style={styles.body}>
        Se estiver pensando em se machucar ou não vê saída, fale agora com alguém:
      </Text>
      {EMERGENCY_CHANNELS.map((c) => (
        <Pressable
          key={c.phone}
          style={styles.btn}
          onPress={() => Linking.openURL(`tel:${c.phone}`)}
          accessibilityRole="button"
          accessibilityLabel={`${c.label}. ${c.detail}`}
        >
          <Text style={styles.btnTxt}>{c.label}</Text>
          <Text style={styles.btnDetail}>{c.detail}</Text>
        </Pressable>
      ))}
      <Pressable onPress={onClose} accessibilityRole="button" hitSlop={12}>
        <Text style={styles.close}>Fechar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: '#fff4f1',
    borderWidth: 2,
    borderColor: colors.danger,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  body: { fontSize: 15, lineHeight: 21, color: colors.ink },
  btn: {
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnDetail: { color: '#ffe3dc', fontSize: 13 },
  close: { textAlign: 'center', color: colors.muted, fontSize: 14, paddingTop: 4 },
});
