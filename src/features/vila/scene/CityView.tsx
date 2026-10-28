import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CITIES, type BuildingType } from '../data/cities';
import type { BuiltMap } from '@/store/useVilaStore';
import { colors, radius } from '@/theme/tokens';
import CityScene from './CityScene';
import { HH, HW } from './painter';

// Câmera da vila: arrastar, pinça e botões +/−, com limites para a cidade não
// sumir da tela. O zoom é real: o SVG é vetorial e é redesenhado na escala nova.
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.8;
const START_ZOOM = 1.45;

interface Props {
  cityIndex: number;
  built: BuiltMap;
  height?: number;
  onPlotPress: (plotId: string) => void;
}

function clamp(v: number, lo: number, hi: number) {
  'worklet';
  return Math.min(hi, Math.max(lo, v));
}

// Altura aproximada de cada prédio (em unidades do SVG), para o toque pegar o prédio inteiro.
const TAP_HEIGHT: Record<BuildingType, number> = {
  house: 30,
  apartment: 52,
  civic: 48,
  shop: 22,
  market: 26,
  sport: 10,
  plaza: 12,
  park: 24,
  garden: 12,
  trees: 26,
  beach: 28,
  kiosk: 22,
  pier: 16,
  palm: 34,
};
const RUIN_HEIGHT = 12;

/** Acha o lote sob um ponto em coordenadas do SVG, começando pelos da frente. */
function plotAt(cityIndex: number, built: BuiltMap, x: number, y: number) {
  const city = CITIES[cityIndex];
  const front = [...city.plots].sort((a, b) => b.gx + b.gy - (a.gx + a.gy));
  return front.find((p) => {
    const cx = city.ox + (p.gx - p.gy) * HW;
    const cy = city.oy + (p.gx + p.gy + 1) * HH;
    const h = built[p.id] ? TAP_HEIGHT[p.type] : RUIN_HEIGHT;
    // Losango do piso (com folga) somado à coluna do prédio acima dele.
    const onTile = Math.abs(x - cx) / HW + Math.abs(y - cy) / HH <= 1.1;
    const onBody = Math.abs(x - cx) <= HW * 0.7 && y <= cy && y >= cy - HH - h;
    return onTile || onBody;
  });
}

export default function CityView({ cityIndex, built, height = 280, onPlotPress }: Props) {
  const [width, setWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(START_ZOOM);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const start = useSharedValue({ s: START_ZOOM, x: 0, y: 0 });
  const pinching = useSharedValue(false);

  useEffect(() => {
    scale.value = START_ZOOM;
    tx.value = 0;
    ty.value = 0;
  }, [cityIndex, scale, tx, ty]);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const handleTap = useCallback(
    (px: number, py: number, s: number, x: number, y: number) => {
      if (!width) return;
      // Desfaz a câmera (a escala é em torno do centro) e depois o encaixe do viewBox.
      const qx = width / 2 + (px - width / 2 - x) / s;
      const qy = height / 2 + (py - height / 2 - y) / s;
      const b = CITIES[cityIndex].bounds;
      const vbW = b.maxx - b.minx;
      const vbH = b.maxy - b.miny;
      const k = Math.min(width / vbW, height / vbH);
      const sx = b.minx + (qx - (width - vbW * k) / 2) / k;
      const sy = b.miny + (qy - (height - vbH * k) / 2) / k;
      const plot = plotAt(cityIndex, built, sx, sy);
      if (plot) onPlotPress(plot.id);
    },
    [built, cityIndex, height, onPlotPress, width],
  );

  const pan = Gesture.Pan()
    .onStart(() => {
      start.value = { s: scale.value, x: tx.value, y: ty.value };
    })
    .onUpdate((e) => {
      if (pinching.value) return;
      const limX = ((scale.value - 1) * width) / 2;
      const limY = ((scale.value - 1) * height) / 2;
      tx.value = clamp(start.value.x + e.translationX, -limX, limX);
      ty.value = clamp(start.value.y + e.translationY, -limY, limY);
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      pinching.value = true;
      start.value = { s: scale.value, x: tx.value, y: ty.value };
    })
    .onUpdate((e) => {
      const s = clamp(start.value.s * e.scale, MIN_ZOOM, MAX_ZOOM);
      const k = s / start.value.s;
      // Mantém parado o ponto entre os dedos.
      const fx = e.focalX - width / 2;
      const fy = e.focalY - height / 2;
      const limX = ((s - 1) * width) / 2;
      const limY = ((s - 1) * height) / 2;
      scale.value = s;
      tx.value = clamp(fx - (fx - start.value.x) * k, -limX, limX);
      ty.value = clamp(fy - (fy - start.value.y) * k, -limY, limY);
    })
    .onEnd(() => {
      pinching.value = false;
    });

  const tap = Gesture.Tap()
    .maxDistance(10)
    .onEnd((e) => {
      runOnJS(handleTap)(e.x, e.y, scale.value, tx.value, ty.value);
    });

  const gesture = Gesture.Race(tap, Gesture.Simultaneous(pan, pinch));

  const zoomBy = (factor: number) => {
    const s = clamp(scale.value * factor, MIN_ZOOM, MAX_ZOOM);
    const k = s / scale.value;
    const limX = ((s - 1) * width) / 2;
    const limY = ((s - 1) * height) / 2;
    const anim = (v: number) => (reduceMotion ? v : withTiming(v, { duration: 180 }));
    scale.value = anim(s);
    tx.value = anim(clamp(tx.value * k, -limX, limX));
    ty.value = anim(clamp(ty.value * k, -limY, limY));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  const city = CITIES[cityIndex];
  const done = Object.keys(built).length;

  return (
    <GestureHandlerRootView style={[styles.viewport, { height }]}>
      {/* O detector fica na camada fixa: assim os toques chegam em coordenadas da tela. */}
      <GestureDetector gesture={gesture}>
        <View
          style={StyleSheet.absoluteFill}
          collapsable={false}
          onLayout={onLayout}
          accessible
          accessibilityLabel={`Mapa da cidade ${city.name}: ${done} de ${city.plots.length} obras concluídas. Use a lista de obras abaixo para construir.`}
        >
          <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            {width > 0 && (
              <CityScene cityIndex={cityIndex} built={built} width={width} height={height} />
            )}
          </Animated.View>
        </View>
      </GestureDetector>
      <View style={styles.zoom}>
        <ZoomButton label="+" a11y="Aproximar" onPress={() => zoomBy(1.3)} />
        <ZoomButton label="−" a11y="Afastar" onPress={() => zoomBy(1 / 1.3)} />
      </View>
    </GestureHandlerRootView>
  );
}

function ZoomButton({
  label,
  a11y,
  onPress,
}: {
  label: string;
  a11y: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [styles.zoomBtn, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.zoomTxt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  viewport: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.sky2,
  },
  zoom: { position: 'absolute', right: 10, bottom: 10, gap: 8 },
  zoomBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomTxt: { fontSize: 22, fontWeight: '700', color: colors.navy },
});
