import { memo, useMemo } from 'react';
import Svg, { G } from 'react-native-svg';
import { CITIES, type BuildingType } from '../data/cities';
import type { BuiltMap } from '@/store/useVilaStore';
import { drawAmbient, drawBuilding, drawRuin } from './buildings';
import { drawGround } from './ground';
import { Painter } from './painter';

interface Props {
  cityIndex: number;
  built: BuiltMap;
  width: number;
  height: number;
  /** Toque em um lote (construído ou não). */
  onPlotPress?: (plotId: string) => void;
}

// Cidade isométrica inteira. Desenha do fundo para a frente (gx + gy crescente)
// para que os prédios da frente cubram os de trás.
function CityScene({ cityIndex, built, width, height, onPlotPress }: Props) {
  const city = CITIES[cityIndex];

  const content = useMemo(() => {
    const ground = new Painter(city.ox, city.oy);
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
          const d = new Painter(city.ox, city.oy);
          o.draw(d);
          const plotId = o.plot;
          return (
            <G
              key={plotId ?? `a${i}`}
              onPress={plotId && onPlotPress ? () => onPlotPress(plotId) : undefined}
            >
              {d.els}
            </G>
          );
        })}
      </>
    );
  }, [city, built, onPlotPress]);

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

/** Miniatura de um prédio, usada no painel da obra. */
export function BuildingPreview({
  type,
  style,
  size,
}: {
  type: BuildingType;
  style: number;
  size: number;
}) {
  const els = useMemo(() => {
    const d = new Painter(170, 120);
    drawBuilding(d, type, { gx: 1.6, gy: 1.6 }, style);
    return d.els;
  }, [type, style]);
  return (
    <Svg width={size} height={(size * 150) / 208} viewBox="66 46 208 150">
      {els}
    </Svg>
  );
}
