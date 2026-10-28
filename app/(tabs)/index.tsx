import { View, Text, StyleSheet } from 'react-native';
// ScrollView do gesture-handler: deixa o arraste/pinça da vila ganhar da rolagem da página.
import { ScrollView } from 'react-native-gesture-handler';
import { VilaSection } from '@/features/vila';
import { DailyActions, PlantBadge, PlantSheets, RecoveryBanner } from '@/features/planta';
import { useProfile } from '@/hooks/useProfile';
import { formatBRL, formatCoins } from '@/lib/format';
import { colors } from '@/theme/tokens';
import { FinanceShortcut } from '@/features/financeiro/components/FinanceShortcut';

// Hub (stub). Mostra as métricas derivadas do store.
export default function Hub() {
  const { coins, preserved, multiplier } = useProfile();
  return (
    <>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.c}>
        <View style={styles.hud}>
          <Text style={styles.h}>Olá!</Text>
          <Text style={styles.m}>Moedas: {formatCoins(coins)}</Text>
          <Text style={styles.m}>Preservado: {formatBRL(preserved)}</Text>
          <Text style={styles.m}>Multiplicador: x{multiplier}</Text>
          <FinanceShortcut />
        </View>
        <VilaSection
          mapOverlay={<PlantBadge />}
          belowMap={
            <>
              <RecoveryBanner />
              <DailyActions />
            </>
          }
        />
      </ScrollView>
      {/* Fora do ScrollView: no Android, um Modal dentro dele abre encolhido. */}
      <PlantSheets />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.sky },
  c: { padding: 20, paddingTop: 56, gap: 20 },
  hud: { gap: 8 },
  h: { fontSize: 24, fontWeight: '700', color: colors.ink },
  m: { fontSize: 15, color: colors.muted },
});
