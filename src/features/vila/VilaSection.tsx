import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import CityHeader from './components/CityHeader';
import ObrasList from './components/ObrasList';
import { CITIES } from './data/cities';
import CityView from './scene/CityView';
import { useGameStore } from '@/store/useGameStore';
import { builtCount, isCityComplete, useVilaStore } from '@/store/useVilaStore';
import { formatCoins } from '@/lib/format';
import { colors, radius, spacing } from '@/theme/tokens';

// Bloco da vila para a tela Início: cidade com câmera e lista de obras. O painel da
// obra abre como rota (app/obra.tsx).
// É autossuficiente (lê e grava nos stores), então a Home só precisa de <VilaSection />.
export default function VilaSection() {
  const coins = useGameStore((s) => s.coins);
  const { cityIndex, built: builtByCity, nextCity } = useVilaStore();
  const city = CITIES[cityIndex];
  const built = builtByCity[cityIndex];
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    AccessibilityInfo.announceForAccessibility(notice);
    const t = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  // Avisa quando uma obra nova é concluída (a construção acontece no painel).
  const done = builtCount(built);
  const lastDone = useRef({ cityIndex, done });
  useEffect(() => {
    const last = lastDone.current;
    if (last.cityIndex === cityIndex && done > last.done) setNotice('Obra concluída!');
    lastDone.current = { cityIndex, done };
  }, [cityIndex, done]);

  const openObra = useCallback(
    (id: string) => router.push({ pathname: '/obra', params: { id } }),
    [],
  );
  const complete = isCityComplete(cityIndex, built);
  const next = CITIES[cityIndex + 1];

  return (
    <View style={styles.c}>
      <CityHeader name={city.name} done={done} total={city.plots.length} />
      <CityView cityIndex={cityIndex} built={built} onPlotPress={openObra} />
      {notice && (
        <View style={styles.notice} accessibilityLiveRegion="polite">
          <Text style={styles.noticeTxt}>{notice}</Text>
        </View>
      )}

      {complete && next && (
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>{city.name} restaurada!</Text>
          <Text style={styles.doneTxt}>Uma nova cidade está pronta: a {next.name}.</Text>
          <Pressable
            onPress={() => {
              nextCity();
              setNotice(`Boas-vindas à ${next.name}`);
            }}
            accessibilityRole="button"
            style={styles.doneBtn}
          >
            <Text style={styles.doneBtnTxt}>Explorar nova cidade</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.listHead}>
        <Text style={styles.h2} accessibilityRole="header">
          Construir a vila
        </Text>
        <Text style={styles.coins}>● {formatCoins(coins)} moedas</Text>
      </View>
      <ObrasList city={city} built={built} onOpen={openObra} />

      {__DEV__ && (
        <Pressable
          onPress={() => useGameStore.setState((s) => ({ coins: s.coins + 300 }))}
          accessibilityRole="button"
          style={styles.dev}
        >
          <Text style={styles.devTxt}>+300 moedas (só em desenvolvimento)</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  c: { gap: spacing.md },
  notice: {
    alignSelf: 'center',
    marginTop: -spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.green,
  },
  noticeTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  doneCard: {
    padding: spacing.md,
    gap: 6,
    borderRadius: radius.lg,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
  },
  doneTitle: { fontSize: 16, fontWeight: '700', color: colors.green600 },
  doneTxt: { fontSize: 13, color: colors.muted, textAlign: 'center' },
  doneBtn: {
    marginTop: 6,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.blue,
    justifyContent: 'center',
  },
  doneBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  listHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  h2: { fontSize: 18, fontWeight: '700', color: colors.ink },
  coins: { fontSize: 14, fontWeight: '700', color: colors.goldInk },
  dev: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.faint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devTxt: { fontSize: 13, color: colors.muted },
});
