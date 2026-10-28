import { useEffect, type ReactNode } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

// Painel que sobe de baixo, desenhado dentro da própria tela (como o .sheet do protótipo).
// Não usa <Modal>: no Android, o Modal abria encolhido e invisível e travava os toques.
export function BottomPanel({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { colors, fs, reduceMotion } = useTheme();

  // "Voltar" do Android fecha o painel.
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        entering={reduceMotion ? undefined : FadeIn.duration(180)}
        exiting={reduceMotion ? undefined : FadeOut.duration(150)}
        style={[StyleSheet.absoluteFill, styles.backdrop]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        />
      </Animated.View>
      <Animated.View
        entering={reduceMotion ? undefined : SlideInDown.duration(260)}
        exiting={reduceMotion ? undefined : SlideOutDown.duration(200)}
        style={[styles.panel, { backgroundColor: colors.bg }]}
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(10,22,46,0.5)' },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '88%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
  },
  grab: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 6 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 12 },
  title: { flex: 1, fontWeight: '700' },
  close: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  body: { padding: 18, paddingBottom: 24, gap: 14 },
});
