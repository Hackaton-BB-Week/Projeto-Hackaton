import type { ComponentProps } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Eyebrow } from '@/components/Eyebrow';
import { useTheme } from '@/theme/useTheme';
import type { Diagnosis } from '../diagnosis';

type Props = { result: Diagnosis };

export function DiagnosisResult({ result }: Props) {
  const { colors, fs } = useTheme();

  return (
    <View style={styles.wrap}>
      <Card style={styles.center}>
        <Feather name="compass" size={40} color={colors.brand} />
        <Text style={[styles.title, { color: colors.ink, fontSize: fs(20) }]} accessibilityRole="header">
          Seu ponto de partida
        </Text>
        <Text style={[styles.p, styles.centerTxt, { color: colors.muted, fontSize: fs(14) }]}>
          Seu principal gatilho parece ser{' '}
          <Text style={{ color: colors.brand700, fontWeight: '700' }}>{result.triggerName}</Text>.
          Vamos trabalhar maneiras de interromper esse ciclo antes que uma nova aposta aconteça.
        </Text>
        {result.triggerChanged && (
          <Text style={[styles.note, styles.centerTxt, { color: colors.muted, fontSize: fs(12.5) }]}>
            É diferente do que você tinha apontado antes. Gatilhos mudam com o tempo, e perceber
            isso ajuda a se preparar.
          </Text>
        )}
      </Card>

      <Card style={styles.gap}>
        <Eyebrow>Recomendações práticas</Eyebrow>
        {result.recommendations.map((r) => (
          <View key={r} style={styles.row}>
            <Feather name="check" size={16} color={colors.brand} style={styles.bullet} />
            <Text style={[styles.p, styles.flex, { color: colors.ink, fontSize: fs(14) }]}>{r}</Text>
          </View>
        ))}
      </Card>

      {result.suggestSupport && (
        <Card style={[styles.gap, { backgroundColor: colors.brandSoft, borderColor: colors.brand }]}>
          <Text style={[styles.supportTitle, { color: colors.ink, fontSize: fs(15.5) }]} accessibilityRole="header">
            Você não precisa lidar com isso sozinho(a)
          </Text>
          <Text style={[styles.p, { color: colors.ink, fontSize: fs(14) }]}>
            Pelo que você contou, pode estar difícil ter controle. Conversar com quem entende do
            assunto ajuda: o CAPS (pelo SUS) e os Jogadores Anônimos oferecem apoio gratuito.
          </Text>
          <Button
            label="Ver canais de ajuda"
            icon="life-buoy"
            variant="outline"
            onPress={() => router.replace('/ajuda')}
          />
        </Card>
      )}

      <Text style={[styles.note, { color: colors.muted, fontSize: fs(12.5) }]}>
        Referência para reflexão, não diagnóstico clínico. {result.spendNote} As moedas que você
        ganha por dia passam a usar esse valor.
      </Text>

      <Button
        label={result.action.label}
        icon={result.action.icon as ComponentProps<typeof Feather>['name']}
        variant="outline"
        onPress={() => router.replace(result.action.href)}
      />
      <Button label="Voltar à vila" onPress={() => router.replace('/(tabs)')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  center: { alignItems: 'center', gap: 8, paddingVertical: 20 },
  centerTxt: { textAlign: 'center' },
  title: { fontWeight: '700', textAlign: 'center' },
  supportTitle: { fontWeight: '700' },
  gap: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bullet: { marginTop: 3 },
  flex: { flex: 1 },
  p: { lineHeight: 21 },
  note: { lineHeight: 18 },
});
