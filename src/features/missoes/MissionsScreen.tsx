import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { useTheme } from '@/theme/useTheme';
import { useGameStore } from '@/store/useGameStore';
import { formatCoins } from '@/lib/format';
import { useDailyMissions } from './useDailyMissions';
import { MissionItem } from './components/MissionItem';
import { MissionPhotoPanel } from './components/MissionPhotoPanel';
import { MissionAlbum, MissionPhotoViewer } from './components/MissionAlbum';
import type { MissionPhoto } from './useMissionPhotosStore';
import type { Mission } from './missions';

// Missões do dia: 3 missões que mudam a cada dia; cada uma vale moedas uma vez.
export function MissionsScreen() {
  const { colors, fs } = useTheme();
  const { missions, complete, doneCount, total } = useDailyMissions();
  const coins = useGameStore((s) => s.coins);
  const allDone = doneCount === total;
  // Missão que a pessoa tocou para concluir (abre o painel da foto).
  const [pending, setPending] = useState<Mission | null>(null);
  const [viewing, setViewing] = useState<MissionPhoto | null>(null);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  return (
    <SafeAreaView style={[styles.c, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <Pressable
          onPress={goBack}
          style={[styles.back, { backgroundColor: colors.surface2 }]}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Feather name="chevron-left" size={22} color={colors.ink} />
        </Pressable>
        <Text
          style={[styles.h, { color: colors.ink, fontSize: fs(17) }]}
          accessibilityRole="header"
        >
          Missões do dia
        </Text>
        <View
          style={[styles.coins, { backgroundColor: colors.surface2, borderColor: colors.line }]}
          accessible
          accessibilityLabel={`Saldo: ${formatCoins(coins)} moedas`}
        >
          <Feather name="disc" size={14} color={colors.gold} />
          <Text style={[styles.coinsTxt, { color: colors.ink, fontSize: fs(13) }]}>
            {formatCoins(coins)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.lead, { color: colors.muted, fontSize: fs(14) }]}>
          Missões ligadas a situações reais das apostas. Concluir dá moedas que reconstroem sua
          vila. Elas mudam a cada dia.
        </Text>

        <View style={styles.progressRow} accessibilityLiveRegion="polite">
          <Text style={[styles.progress, { color: colors.ink, fontSize: fs(13) }]}>
            {doneCount} de {total} concluídas hoje
          </Text>
        </View>

        {missions.map((m) => (
          <MissionItem key={m.id} mission={m} onComplete={() => setPending(m)} />
        ))}

        {allDone && (
          <Card style={styles.center}>
            <Feather name="sun" size={26} color={colors.green600} />
            <Text style={[styles.doneTitle, { color: colors.ink, fontSize: fs(16) }]}>
              Tudo feito por hoje 💛
            </Text>
            <Text style={[styles.doneP, { color: colors.muted, fontSize: fs(13) }]}>
              Amanhã tem missões novas. Cuidar de você um dia de cada vez já é progresso.
            </Text>
          </Card>
        )}
        <MissionAlbum onOpen={setViewing} />
      </ScrollView>

      {/* Fora do ScrollView: os painéis cobrem a tela inteira. */}
      <MissionPhotoViewer photo={viewing} onClose={() => setViewing(null)} />
      <MissionPhotoPanel
        mission={pending}
        onClose={() => setPending(null)}
        onConfirm={(photoUri) => {
          if (pending) complete(pending.id, photoUri);
          setPending(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  back: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  h: { flex: 1, fontWeight: '700' },
  coins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 11,
  },
  coinsTxt: { fontWeight: '700', fontVariant: ['tabular-nums'] },
  body: { padding: 18, gap: 12 },
  lead: { lineHeight: 21 },
  progressRow: { flexDirection: 'row' },
  progress: { fontWeight: '700' },
  center: { alignItems: 'center', gap: 6 },
  doneTitle: { fontWeight: '700', textAlign: 'center' },
  doneP: { textAlign: 'center', lineHeight: 19 },
});
