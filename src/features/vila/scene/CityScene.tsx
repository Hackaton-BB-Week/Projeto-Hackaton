import { memo, useMemo } from 'react';
import Svg, { G } from 'react-native-svg';
import { CITIES, type BuildingType } from '../data/cities';
import type { BuiltMap } from '@/store/useVilaStore';
import { drawAmbient, drawBuilding, drawRuin } from './buildings';
import { drawGround } from './ground';
import { Painter } from './painter';
import { useSettingsStore } from '@/store/useSettingsStore';
import { tintFor } from '@/theme/colorblind';

interface Props {
  cityIndex: number;
  built: BuiltMap;
  width: number;
  height: number;
}

// Cidade isométrica inteira. Desenha do fundo para a frente (gx + gy crescente)
// para que os prédios da frente cubram os de trás. O toque nos lotes é tratado em CityView.
function CityScene({ cityIndex, built, width, height }: Props) {
  const city = CITIES[cityIndex];
  // Modo daltonismo: telhados, árvores, gramado etc. passam pelo filtro de cor.
  const colorblind = useSettingsStore((s) => s.colorblind);

  const content = useMemo(() => {
    const tint = tintFor(colorblind);
    const ground = new Painter(city.ox, city.oy, tint);
    drawGround(ground, city);

    const objects = [
      ...city.plots.map((p) => ({
        k: p.gx + p.gy,
        sub: p.gx,
        plot: p.id,
        draw: (d: Painter) => {
          const b = built[p.id];
          if (b) drawBuilding(d, p.type, p, b.style);
          else drawRuin(d, p);
        },
      })),
      ...city.ambient.map((a) => ({
        k: a.gx + a.gy,
        sub: a.gx,
        plot: null,
        draw: (d: Painter) => drawAmbient(d, a),
      })),
    ].sort((a, b) => a.k - b.k || a.sub - b.sub);

    return (
      <>
        <G>{ground.els}</G>
        {objects.map((o, i) => {
          const d = new Painter(city.ox, city.oy, tint);
          o.draw(d);
          return <G key={o.plot ?? `a${i}`}>{d.els}</G>;
        })}
      </>
    );
  }, [city, built, colorblind]);

  const b = city.bounds;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`${b.minx} ${b.miny} ${b.maxx - b.minx} ${b.maxy - b.miny}`}
    >
      {content}
    </Svg>
  );
}

export default memo(CityScene);

/** Miniatura de um prédio: `tight` enquadra só o prédio (cards); senão, com folga (painel). */
export function BuildingPreview({
  type,
  style,
  size,
  tight,
}: {
  type: BuildingType;
  style: number;
  size: number;
  tight?: boolean;
}) {
  const colorblind = useSettingsStore((s) => s.colorblind);
  const els = useMemo(() => {
    const d = new Painter(170, 120, tintFor(colorblind));
    drawBuilding(d, type, { gx: 1.6, gy: 1.6 }, style);
    return d.els;
  }, [type, style, colorblind]);
  return (
    <Svg
      width={size}
      height={tight ? (size * 70) / 56 : (size * 150) / 208}
      // Sem `tight`, o quadro desce um pouco: a base e a sombra do prédio não ficam cortadas.
      viewBox={tight ? '142 118 56 70' : '66 62 208 150'}
    >
      {els}
    </Svg>
  );
}
