import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Eyebrow } from '@/components/Eyebrow';
import { useTheme } from '@/theme/useTheme';
import { SCENARIOS } from '../scenarios';

type Props = { protectiveCount: number; total: number; earned: number; onRestart: () => void };

export function SummaryView({ protectiveCount, total, earned, onRestart }: Props) {
  const { colors, fs } = useTheme();

  return (
    <View style={styles.wrap}>
      <Card style={styles.center}>
        <Feather name="book-open" size={36} color={colors.brand} />
        <Text style={[styles.title, { color: colors.ink, fontSize: fs(20) }]} accessibilityRole="header">
          Você passou por {total} situações
        </Text>
        <Text style={[styles.p, styles.centerTxt, { color: colors.muted, fontSize: fs(14) }]}>
          Em {protectiveCount} delas você escolheu um caminho que protege. Isso não é uma prova:
          o importante é reconhecer as armadilhas antes que elas apareçam na vida real.
        </Text>
        {earned > 0 && (
          <Text style={[styles.earned, { color: colors.green600, fontSize: fs(13.5) }]}>
            +{earned} moedas para a sua vila
          </Text>
        )}
      </Card>

      <Card style={styles.gap}>
        <Eyebrow>O que levar daqui</Eyebrow>
        {SCENARIOS.map((s) => (
          <View key={s.id} style={styles.row}>
            <Feather name="check" size={15} color={colors.brand} />
            <Text style={[styles.item, { color: colors.ink, fontSize: fs(14) }]}>{s.learn.title}</Text>
          </View>
        ))}
      </Card>

      <Text style={[styles.note, { color: colors.muted, fontSize: fs(12.5) }]}>
        Este quiz é só educativo: nenhuma aposta acontece aqui. Se apostar está pesando, a aba
        Ajuda tem canais gratuitos e sigilosos.
      </Text>

      <Button label="Recomeçar" icon="rotate-ccw" onPress={onRestart} />
      <Button
        label="Ver canais de ajuda"
        variant="outline"
        icon="life-buoy"
        onPress={() => router.replace('/ajuda')}
      />
      <Button label="Voltar à vila" variant="ghost" onPress={() => router.replace('/(tabs)')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  center: { alignItems: 'center', gap: 8, paddingVertical: 20 },
  centerTxt: { textAlign: 'center' },
  title: { fontWeight: '700', textAlign: 'center' },
  earned: { fontWeight: '700' },
  gap: { gap: 10 },
  p: { lineHeight: 21 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  item: { flex: 1 },
  note: { lineHeight: 18 },
});
