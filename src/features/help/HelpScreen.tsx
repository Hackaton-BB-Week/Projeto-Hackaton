import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useRootNavigationState } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Eyebrow } from '@/components/Eyebrow';
import { useTheme } from '@/theme/useTheme';
import { useHelpChannels } from './useHelpChannels';
import { ChannelItem } from './components/ChannelItem';
import { BreathingSheet } from './components/BreathingSheet';

export function HelpScreen() {
  const { colors, fs } = useTheme();
  const channels = useHelpChannels();
  const [breathing, setBreathing] = useState(false);

  // `/ajuda?respirar=1` (ex.: vindo do modo pré-jogo) já abre o exercício.
  // Só mexe na rota depois que a navegação montou: abrindo (ou recarregando, na web)
  // direto nessa URL, setParams cedo demais derruba o app.
  const { respirar } = useLocalSearchParams<{ respirar?: string }>();
  const navReady = !!useRootNavigationState()?.key;
  useEffect(() => {
    if (respirar && navReady) {
      setBreathing(true);
      router.setParams({ respirar: undefined });
    }
  }, [respirar, navReady]);

  return (
    <SafeAreaView style={[styles.c, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.head}>
          <Text
            style={[styles.h1, { color: colors.ink, fontSize: fs(26) }]}
            accessibilityRole="header"
          >
            Ajuda e apoio
          </Text>
          <Text style={[styles.lead, { color: colors.muted, fontSize: fs(14) }]}>
            Você não está sozinho(a). Estes recursos são gratuitos e sigilosos.
          </Text>
        </View>

        <Card style={{ backgroundColor: colors.feature, borderColor: colors.feature }}>
          <Text style={[styles.h4, { fontSize: fs(17) }]} accessibilityRole="header">
            Prefere conversar sobre o que está acontecendo?
          </Text>
          <Text style={[styles.talkP, { color: colors.featureMuted, fontSize: fs(13) }]}>
            A Rô te ajuda com a vontade de apostar, a organizar o dinheiro e a achar apoio.
          </Text>
          <Button
            label="Conversar com a Rô"
            icon="message-circle"
            accessibilityHint="Abre a aba Conversar"
            onPress={() => router.navigate('/chat')}
          />
        </Card>

        <Card style={styles.gap}>
          <Eyebrow>Respiração guiada</Eyebrow>
          <Text style={[styles.lead, { color: colors.muted, fontSize: fs(13) }]}>
            Um exercício curto para quando a vontade ou a ansiedade apertarem.
          </Text>
          <Button
            label="Iniciar exercício de respiração"
            variant="outline"
            icon="wind"
            onPress={() => setBreathing(true)}
          />
        </Card>

        <Card style={styles.channels}>
          {channels.map((ch, i) => (
            <ChannelItem key={ch.id} channel={ch} last={i === channels.length - 1} />
          ))}
        </Card>

        <Text style={[styles.disclaimer, { color: colors.muted, fontSize: fs(12.5) }]}>
          O Rolê que Rende é um apoio complementar e não substitui atendimento de saúde. Em
          emergência, procure o serviço médico mais próximo.
        </Text>
      </ScrollView>

      <BreathingSheet visible={breathing} onClose={() => setBreathing(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 32, gap: 14 },
  head: { gap: 4, marginBottom: 2 },
  h1: { fontWeight: '800', letterSpacing: -0.4 },
  lead: { lineHeight: 21 },
  h4: { color: '#ffffff', fontWeight: '700' },
  talkP: { lineHeight: 19, marginTop: 5, marginBottom: 12 },
  gap: { gap: 10 },
  channels: { paddingVertical: 0 },
  disclaimer: { lineHeight: 18 },
});
