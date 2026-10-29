import { useEffect, type ReactNode } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSwipeToClose } from '@/hooks/useSwipeToClose';
import { useTheme } from '@/theme/useTheme';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

// Painel que sobe de baixo, desenhado dentro da própria tela (como o .sheet do protótipo).
// Compartilhado: planta, missões e o que mais precisar de um painel inferior.
// Não usa <Modal>: no Android, o Modal abria encolhido e invisível e travava os toques.
// Fecha deslizando para baixo, pelo X, tocando fora ou no "voltar" do Android.
export function BottomPanel(props: Props) {
  if (!props.visible) return null;
  return <Panel {...props} />;
}

function Panel({ title, onClose, children }: Props) {
  const { colors, fs } = useTheme();
  const { gesture, panelStyle, backdropStyle, onLayout, dismiss } = useSwipeToClose(onClose, {
    animateIn: true,
  });

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      dismiss();
      return true;
    });
    return () => sub.remove();
  }, [dismiss]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismiss}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        />
      </Animated.View>
      <Animated.View
        onLayout={onLayout}
        style={[styles.panel, { backgroundColor: colors.bg }, panelStyle]}
        accessibilityViewIsModal
      >
        {/* Alça + título: área de arrastar (o conteúdo abaixo continua rolando). */}
        <GestureDetector gesture={gesture}>
          <View>
            <View style={[styles.grab, { backgroundColor: colors.line }]} />
            <View style={styles.header}>
              <Text
                style={[styles.title, { color: colors.ink, fontSize: fs(18) }]}
                accessibilityRole="header"
              >
                {title}
              </Text>
              <Pressable
                onPress={dismiss}
                style={[styles.close, { backgroundColor: colors.surface2 }]}
                accessibilityRole="button"
                accessibilityLabel={`Fechar ${title}`}
              >
                <Feather name="x" size={20} color={colors.ink} />
              </Pressable>
            </View>
          </View>
        </GestureDetector>
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
