import { useState } from 'react';
import { View, Text, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useTheme, type Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatBRL } from '@/lib/format';
import type { SimPoint } from '../investment';

const H = 150;
const PAD = { top: 10, bottom: 8, left: 4, right: 4 };

/**
 * Linha do saldo: 12 meses passados (contínua) + 12 de projeção (tracejada).
 * A linha fina mostra só o que foi aportado, para ver o rendimento entre as duas.
 */
export function GrowthChart({ points, color }: { points: SimPoint[]; color: string }) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const [w, setW] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

  const max = Math.max(1, ...points.map((p) => p.balance));
  const n = points.length;
  const x = (i: number) => PAD.left + (i / Math.max(1, n - 1)) * (w - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - v / max) * (H - PAD.top - PAD.bottom);
  const path = (list: SimPoint[], key: 'balance' | 'invested', offset = 0) =>
    list.map((p, i) => `${i ? 'L' : 'M'}${x(i + offset).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');

  const todayIdx = points.findIndex((p) => p.projected) - 1;
  const past = points.slice(0, todayIdx + 1);
  const future = points.slice(todayIdx); // começa no "hoje" para a linha emendar
  const today = points[todayIdx];

  return (
    <View>
      <View style={styles.yRow}>
        <Text style={styles.axis}>{formatBRL(max)}</Text>
      </View>
      <View onLayout={onLayout} style={{ height: H }}>
        {w > 0 && today && (
          <Svg width={w} height={H}>
            <Line x1={0} x2={w} y1={y(0)} y2={y(0)} stroke={colors.line} strokeWidth={1} />
            <Line
              x1={x(todayIdx)}
              x2={x(todayIdx)}
              y1={PAD.top}
              y2={y(0)}
              stroke={colors.line}
              strokeDasharray="3 3"
            />
            <Path d={path(points, 'invested')} stroke={colors.faint} strokeWidth={1.5} fill="none" />
            <Path d={path(past, 'balance')} stroke={color} strokeWidth={3} fill="none" />
            <Path
              d={path(future, 'balance', todayIdx)}
              stroke={color}
              strokeWidth={3}
              strokeDasharray="6 5"
              fill="none"
            />
            <Circle cx={x(todayIdx)} cy={y(today.balance)} r={5} fill={color} />
          </Svg>
        )}
      </View>
      <View style={styles.xRow}>
        <Text style={styles.axis}>{points[0]?.label}</Text>
        <Text style={[styles.axis, styles.today]}>hoje</Text>
        <Text style={styles.axis}>{points[n - 1]?.label}</Text>
      </View>
      <View style={styles.legend}>
        <Legend color={color} label="saldo" />
        <Legend color={color} label="projeção" dashed />
        <Legend color={colors.faint} label="só o aportado" />
      </View>
    </View>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.legItem}>
      <Svg width={18} height={6}>
        <Line x1={0} x2={18} y1={3} y2={3} stroke={color} strokeWidth={3} strokeDasharray={dashed ? '5 3' : undefined} />
      </Svg>
      <Text style={styles.axis}>{label}</Text>
    </View>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
    yRow: { marginBottom: 2 },
    xRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    axis: { fontSize: fs(11), color: colors.muted, fontVariant: ['tabular-nums'] },
    today: { fontWeight: '700', color: colors.ink },
    legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
    legItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  });
