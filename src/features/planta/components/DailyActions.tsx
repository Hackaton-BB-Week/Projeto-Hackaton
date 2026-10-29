import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';
import { formatCoins } from '@/lib/format';
import { usePlantStore } from '@/store/usePlantStore';
import { useGameStore } from '@/store/useGameStore';
import { plantStage } from '../plant';
import { usePlantUi } from '../usePlant';

// Botões abaixo da vila: registrar um dia sem apostar e registrar uma recaída.
export function DailyActions() {
  const open = usePlantUi((s) => s.open);
  const registerDay = usePlantStore((s) => s.registerDay);

  const play = usePlantUi((s) => s.play);

  const onDay = () => {
    const before = plantStage(useGameStore.getState().total);
    const r = registerDay();
    if (r.ok) {
      play(plantStage(useGameStore.getState().total) > before ? 'grow' : 'water');
      showToast(`Dia registrado! +${formatCoins(r.coins)} moedas · Sequência: ${r.streak}`);
    } else {
      open(r.reason === 'already' ? 'already' : 'relapseToday');
    }
  };

  return (
    <View style={styles.c}>
      <Button
        label="Registrar novo dia sem apostar"
        icon="check"
        variant="success"
        onPress={onDay}
        accessibilityHint="Conta um dia sem apostar, rende moedas e faz a planta crescer"
      />
      <Button
        label="Registrar uma recaída"
        variant="danger"
        onPress={() => open('relapseConfirm')}
        accessibilityHint="Pausa a sequência sem apagar o que você construiu"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  c: { gap: 10 },
});
