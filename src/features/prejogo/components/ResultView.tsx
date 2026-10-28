import { View, Text, StyleSheet } from 'react-native';
import { router, type Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Eyebrow } from '@/components/Eyebrow';
import { useTheme } from '@/theme/useTheme';
import { useChannelActions } from '@/features/help/useHelpChannels';
import type { PreJogoResult } from '../preJogo';

type Props = { result: PreJogoResult; onRestart: () => void };

export function ResultView({ result, onRestart }: Props) {
  const { colors, fs } = useTheme();
  const { call } = useChannelActions();

  // Troca a tela do pré-jogo pelo destino: "voltar" depois leva à vila, não ao questionário.
  const go = (href: string) => router.replace(href as Href);

  return (
    <View style={styles.wrap}>
      <Card style={styles.center}>
        <Feather name="shield" size={40} color={colors.brand} />
        <Text style={[styles.title, { color: colors.ink, fontSize: fs(20) }]} accessibilityRole="header">
          {result.title}
        </Text>
        <Text style={[styles.p, styles.centerTxt, { color: colors.muted, fontSize: fs(14) }]}>
          {result.intro}
        </Text>
      </Card>

      {result.needsSupport && (
        <Card
          style={[styles.gap, { backgroundColor: colors.dangerSoft, borderColor: colors.danger }]}
        >
          <Text
            style={[styles.supportTitle, { color: colors.ink, fontSize: fs(16) }]}
            accessibilityRole="header"
          >
            Fale com alguém agora
          </Text>
          <Text style={[styles.p, { color: colors.ink, fontSize: fs(14) }]}>
            O CVV atende 24h, de graça e com sigilo, pelo 188. Você também pode conversar com
            alguém de confiança.
          </Text>
          <Button
            label="Ligar para o CVV (188)"
            icon="phone"
            variant="navy"
            accessibilityLabel="Ligar para o CVV, número 188"
            onPress={() => call('188')}
          />
        </Card>
      )}

      <Card style={styles.gap}>
        <Eyebrow>Sobre o que você sentiu</Eyebrow>
        {result.insights.map((t) => (
          <Text key={t} style={[styles.p, { color: colors.ink, fontSize: fs(14) }]}>
            {t}
          </Text>
        ))}
      </Card>

      <Card style={[styles.gap, { backgroundColor: colors.brandSoft, borderColor: colors.brand }]}>
        <Eyebrow>Seu plano agora</Eyebrow>
        <Text style={[styles.p, { color: colors.ink, fontSize: fs(14.5) }]}>{result.plan}</Text>
        {result.goalReminder && (
          <Text style={[styles.goal, { color: colors.brand700, fontSize: fs(13.5) }]}>
            {result.goalReminder}
          </Text>
        )}
      </Card>

      <View style={styles.actions}>
        {result.actions.map((a) => (
          <Button
            key={a.id}
            label={a.label}
            icon={a.icon}
            variant={a.variant}
            onPress={() => go(a.href)}
          />
        ))}
        <Button label="Refazer o pré-jogo" variant="ghost" icon="rotate-ccw" onPress={onRestart} />
        <Button label="Voltar à vila" variant="ghost" onPress={() => go('/(tabs)')} />
      </View>
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
  p: { lineHeight: 21 },
  goal: { fontWeight: '700', lineHeight: 19 },
  actions: { gap: 10 },
});
