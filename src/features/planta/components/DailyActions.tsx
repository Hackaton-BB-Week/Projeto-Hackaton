import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';
import { formatCoins } from '@/lib/format';
import { usePlantStore } from '@/store/usePlantStore';
import { useGameStore } from '@/store/useGameStore';
import { plantStage } from '../plant';
import { useTheme } from '@/theme/useTheme';
import { usePlantUi } from '../usePlant';

// Botões abaixo da vila: registrar um dia sem apostar e registrar uma recaída.
export function DailyActions() {
  const { colors } = useTheme();
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
        onPress={onDay}
        accessibilityHint="Conta um dia sem apostar, rende moedas e faz a planta crescer"
      />
      <Button
        label="Registrar uma recaída"
        variant="outline"
        onPress={() => open('relapseConfirm')}
        style={{ borderColor: colors.danger }}
        accessibilityHint="Pausa a sequência sem apagar o que você construiu"
      />
      {__DEV__ && (
        <Button
          label="Simular +1 dia (só em desenvolvimento)"
          variant="ghost"
          small
          onPress={() => {
            usePlantStore.getState().devAdvanceDay();
            usePlantStore.getState().checkAbsence();
            showToast('Um dia se passou (simulação)');
          }}
          style={styles.dev}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  c: { gap: 10 },
  dev: { alignSelf: 'center' },
});
