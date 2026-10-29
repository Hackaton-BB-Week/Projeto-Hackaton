import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { radius, spacing } from '@/theme/tokens';
import type { Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { EMERGENCY_CHANNELS } from '../crisis';

// Cartão fixo com os canais de emergência. Aparece quando a mensagem tem sinal de crise.
export function CrisisCard({ onClose }: { onClose: () => void }) {
  const styles = useThemedStyles(makeStyles);
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

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  card: {
    margin: spacing.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSoft,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  title: { fontSize: fs(18), fontWeight: '700', color: colors.ink },
  body: { fontSize: fs(15), lineHeight: fs(21), color: colors.ink },
  btn: {
    backgroundColor: colors.dangerStrong,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  btnTxt: { color: '#fff', fontSize: fs(16), fontWeight: '700' },
  btnDetail: { color: '#ffffff', fontSize: fs(13) },
  close: { textAlign: 'center', color: colors.muted, fontSize: fs(14), paddingTop: 4 },
});
