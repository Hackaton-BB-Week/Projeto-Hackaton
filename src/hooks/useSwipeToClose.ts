import { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/useTheme';

/**
 * Painel que fecha deslizando para baixo (o mesmo caminho por onde entrou).
 * Arrastar mais de 30% da altura, ou um puxão rápido, fecha; menos que isso, volta.
 *
 * - `gesture`: coloque num <GestureDetector> em volta do painel (ou da alça).
 * - `panelStyle` / `backdropStyle`: estilos animados do painel e do fundo escuro.
 * - `dismiss()`: fecha com a mesma animação (para o X, o fundo e o "voltar").
 * - `animateIn`: faz a entrada subindo (para painéis que não têm animação própria).
 */
export function useSwipeToClose(onClose: () => void, { animateIn = false } = {}) {
  const { reduceMotion } = useTheme();
  const height = useSharedValue(800);
  const ty = useSharedValue(animateIn && !reduceMotion ? 800 : 0);

  // Ref para o runOnJS sempre chamar a versão atual do onClose.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const callClose = useCallback(() => closeRef.current(), []);

  useEffect(() => {
    if (animateIn && !reduceMotion) ty.value = withTiming(0, { duration: 260 });
  }, [animateIn, reduceMotion, ty]);

  const onLayout = (e: LayoutChangeEvent) => {
    height.value = e.nativeEvent.layout.height;
  };

  const dismiss = useCallback(() => {
    if (reduceMotion) {
      callClose();
      return;
    }
    ty.value = withTiming(height.value + 40, { duration: 200 }, (done) => {
      if (done) runOnJS(callClose)();
    });
  }, [reduceMotion, callClose, ty, height]);

  // Só ativa com arraste vertical: toques e rolagem horizontal continuam normais.
  const gesture = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetX([-24, 24])
    .onUpdate((e) => {
      ty.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > height.value * 0.3 || e.velocityY > 900) {
        ty.value = withTiming(height.value + 40, { duration: 180 }, (done) => {
          if (done) runOnJS(callClose)();
        });
      } else {
        ty.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const panelStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(1, ty.value / Math.max(1, height.value)),
  }));

  return { gesture, panelStyle, backdropStyle, onLayout, dismiss };
}
