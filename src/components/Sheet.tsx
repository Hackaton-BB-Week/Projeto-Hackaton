import type { ReactNode } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/** Painel que sobe de baixo (modal). Fecha pelo X, tocando fora ou no "voltar" do Android. */
export function Sheet({ visible, title, onClose, children }: Props) {
  const { colors, fs, reduceMotion } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? 'none' : 'slide'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        />
        <View
          style={[
            styles.panel,
            { backgroundColor: colors.bg, paddingBottom: Math.max(insets.bottom, 16) },
          ]}
          accessibilityViewIsModal
        >
          <View style={[styles.grab, { backgroundColor: colors.line }]} />
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: colors.ink, fontSize: fs(18) }]}
              accessibilityRole="header"
            >
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              style={[styles.close, { backgroundColor: colors.surface2 }]}
              accessibilityRole="button"
              accessibilityLabel={`Fechar ${title}`}
            >
              <Feather name="x" size={20} color={colors.ink} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} bounces={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10,22,46,0.5)' },
  panel: { maxHeight: '92%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 10 },
  grab: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 6 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 12 },
  title: { flex: 1, fontWeight: '700' },
  close: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 18, gap: 14 },
});
