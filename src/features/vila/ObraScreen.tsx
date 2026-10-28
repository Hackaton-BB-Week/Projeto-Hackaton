import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ObraSheet from './components/ObraSheet';
import { CITIES } from './data/cities';
import { useGameStore } from '@/store/useGameStore';
import { useVilaStore } from '@/store/useVilaStore';

// Painel da obra como rota (app/obra.tsx). Uma rota com apresentação
// transparentModal fica por cima das abas e recebe toques normalmente, ao
// contrário do <Modal> do React Native, que quebra no Android com a nova arquitetura.
export default function ObraScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const coins = useGameStore((s) => s.coins);
  const { cityIndex, built, build } = useVilaStore();
  const plot = CITIES[cityIndex].plots.find((p) => p.id === id);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));
  if (!plot) return null;

  return (
    <ObraSheet
      plot={plot}
      built={built[cityIndex]}
      coins={coins}
      bottomInset={insets.bottom}
      onBuild={(plotId, style) => {
        if (build(plotId, style)) close();
      }}
      onClose={close}
    />
  );
}
