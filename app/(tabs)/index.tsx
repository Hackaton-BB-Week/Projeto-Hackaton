import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// ScrollView do gesture-handler: deixa o arraste/pinça da vila ganhar da rolagem da página.
import { ScrollView } from 'react-native-gesture-handler';
import { VilaSection } from '@/features/vila';
import { DailyActions, PlantBadge, PlantSheets, RecoveryBanner } from '@/features/planta';
import { HomeHud } from '@/features/inicio/HomeHud';
import { HomeShortcuts } from '@/features/inicio/HomeShortcuts';
import { useTheme } from '@/theme/useTheme';

// Início: HUD fixo no topo, vila, registro do dia e atalhos (layout do protótipo).
export default function Hub() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.c}
        stickyHeaderIndices={[0]}
      >
        <HomeHud />
        <View style={styles.body}>
          <VilaSection
            mapOverlay={<PlantBadge />}
            belowMap={
              <>
                <RecoveryBanner />
                <DailyActions />
                <HomeShortcuts />
              </>
            }
          />
        </View>
      </ScrollView>
      {/* Fora do ScrollView: no Android, um Modal dentro dele abre encolhido. */}
      <PlantSheets />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  c: { paddingBottom: 28 },
  body: { paddingHorizontal: 16, paddingTop: 12 },
});
