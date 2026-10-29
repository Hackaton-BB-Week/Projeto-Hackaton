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
 * Saldo estimado de hoje até 12 meses à frente. A linha fina mostra só o que foi
 * aportado, para ver o rendimento entre as duas.
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
  const path = (key: 'balance' | 'invested') =>
    points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');

  const first = points[0];
  const last = points[n - 1];

  return (
    <View>
      <View style={styles.yRow}>
        <Text style={styles.axis}>{formatBRL(max)}</Text>
      </View>
      <View onLayout={onLayout} style={{ height: H }}>
        {w > 0 && first && last && (
          <Svg width={w} height={H}>
            <Line x1={0} x2={w} y1={y(0)} y2={y(0)} stroke={colors.line} strokeWidth={1} />
            <Path d={path('invested')} stroke={colors.faint} strokeWidth={1.5} fill="none" />
            <Path d={path('balance')} stroke={color} strokeWidth={3} fill="none" />
            <Circle cx={x(0)} cy={y(first.balance)} r={4} fill={color} />
            <Circle cx={x(n - 1)} cy={y(last.balance)} r={5} fill={color} />
          </Svg>
        )}
      </View>
      <View style={styles.xRow}>
        <Text style={[styles.axis, styles.today]}>{first?.label}</Text>
        <Text style={styles.axis}>{points[Math.floor(n / 2)]?.label}</Text>
        <Text style={styles.axis}>{last?.label}</Text>
      </View>
      <View style={styles.legend}>
        <Legend color={color} label="saldo estimado" />
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
