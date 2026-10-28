import { useEffect } from 'react';
import { AppState, View, Text, StyleSheet } from 'react-native';
import { Sheet } from '@/components/Sheet';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { showToast } from '@/components/Toast';
import { usePlantStore } from '@/store/usePlantStore';
import { useTheme } from '@/theme/useTheme';
import { RECOVERY_BONUS } from '../plant';
import { usePlant, usePlantUi, type PlantSheetKind } from '../usePlant';
import { PlantArt } from './PlantArt';

/** Verifica se a planta murchou por ausência ao abrir o app e ao voltar para ele. */
function useAbsenceCheck() {
  useEffect(() => {
    const run = () => usePlantStore.getState().checkAbsence();
    if (usePlantStore.persist.hasHydrated()) run();
    const unsub = usePlantStore.persist.onFinishHydration(run);
    const sub = AppState.addEventListener('change', (st) => st === 'active' && run());
    return () => {
      unsub();
      sub.remove();
    };
  }, []);
}

// Todos os painéis da planta. Montado uma vez na Home.
export function PlantSheets() {
  const TITLES: Record<PlantSheetKind, string> = {
    plant: 'Sua planta',
    recovery: 'Missão de retomada',
    relapseConfirm: 'Tudo bem, isso faz parte',
    relapseThanks: 'Obrigado por registrar 💛',
    already: 'Progresso de hoje já registrado',
    relapseToday: 'Hoje foi um dia difícil',
  };
  useAbsenceCheck();
  const { colors, fs, reduceMotion } = useTheme();
  const { sheet, open, close } = usePlantUi();
  const p = usePlant();
  const registerRelapse = usePlantStore((s) => s.registerRelapse);
  const completeRecovery = usePlantStore((s) => s.completeRecovery);

  const sub = [styles.sub, { color: colors.muted, fontSize: fs(14) }];

  const plantText = !p.wither
    ? 'Está saudável e crescendo a cada dia sem apostar.'
    : p.witherReason === 'relapse'
      ? 'Está passando por um momento difícil (recaída), mas mantém o tamanho que você já conquistou. Faça a missão de retomada para ajudá-la.'
      : 'Ficou um dia sem cuidado e murchou, mas mantém o tamanho que você já conquistou. Uma missão rapidinha ajuda ela a se recuperar.';

  // Um Sheet só, com o conteúdo do painel aberto: no Android, vários Modals
  // montados ao mesmo tempo abrem encolhidos no canto.
  return (
    <Sheet visible={sheet !== null} title={sheet ? TITLES[sheet] : ''} onClose={close}>
      {sheet === 'plant' && (
        <>
          <Text style={sub}>{plantText}</Text>
          <Card style={styles.row}>
            <PlantArt stage={p.stage} wither={p.wither} size={84} animate={!reduceMotion} />
            <View style={styles.flex}>
              <Text style={[styles.stage, { color: colors.ink, fontSize: fs(16) }]}>
                {p.wither ? 'Precisando de cuidado' : p.stageName}
              </Text>
              <Text style={[styles.meta, { color: colors.muted, fontSize: fs(12.5) }]}>
                Sequência: {p.streak} {p.streak === 1 ? 'dia' : 'dias'} · Total: {p.total}{' '}
                {p.total === 1 ? 'dia' : 'dias'}
              </Text>
              {p.daysToNext !== null && (
                <Text style={[styles.meta, { color: colors.muted, fontSize: fs(12.5) }]}>
                  Faltam {p.daysToNext} {p.daysToNext === 1 ? 'dia' : 'dias'} para:{' '}
                  {p.nextStageName}
                </Text>
              )}
            </View>
          </Card>
          {p.wither && <Button label="Fazer missão de retomada" onPress={() => open('recovery')} />}
          <Button label="Fechar" variant="ghost" onPress={close} />
        </>
      )}
      {sheet === 'recovery' && (
        <>
          <Text style={sub}>
            Um gesto pequeno de cuidado, no seu tempo. Isto não conta como um novo dia — é só pra
            ajudar você e sua planta a recuperarem o fôlego.
          </Text>
          <Card>
            <Text style={[styles.mission, { color: colors.ink, fontSize: fs(15) }]}>
              {p.recoveryMission}
            </Text>
          </Card>
          <Button
            label="Concluí, me sinto melhor"
            onPress={() => {
              completeRecovery();
              close();
              showToast(`Que bom te ver de volta · +${RECOVERY_BONUS} moedas de autocuidado`);
            }}
          />
          <Button label="Agora não" variant="ghost" onPress={close} />
        </>
      )}
      {sheet === 'relapseConfirm' && (
        <>
          <Text style={sub}>
            Você pode registrar o que aconteceu sem perder tudo o que já construiu. Sua cidade
            continua inteira, suas moedas permanecem, e a planta mantém o tamanho conquistado. A
            sequência recomeça e o multiplicador volta a ×1.
          </Text>
          <Button
            label="Registrar e seguir em frente"
            variant="navy"
            onPress={() => {
              registerRelapse();
              open('relapseThanks');
            }}
          />
          <Button label="Agora não" variant="ghost" onPress={close} />
        </>
      )}
      {sheet === 'relapseThanks' && (
        <>
          <Text style={sub}>
            Você não perdeu o que construiu. Quando estiver pronto, a missão de retomada ajuda sua
            planta a se recuperar.
          </Text>
          <Button label="Fazer missão de retomada" onPress={() => open('recovery')} />
          <Button label="Mais tarde" variant="ghost" onPress={close} />
        </>
      )}
      {sheet === 'already' && (
        <>
          <Text style={sub}>
            Você já registrou seu progresso de hoje. Amanhã poderá registrar um novo dia — o
            contador acompanha datas reais, não cliques.
          </Text>
          <Button label="Entendi" variant="navy" onPress={close} />
        </>
      )}
      {sheet === 'relapseToday' && (
        <>
          <Text style={sub}>
            Você registrou uma recaída hoje. Amanhã você poderá registrar um novo dia firme — um
            passo de cada vez.
          </Text>
          <Button label="Entendi" variant="navy" onPress={close} />
        </>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  sub: { lineHeight: 21 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  flex: { flex: 1, gap: 3 },
  stage: { fontWeight: '700' },
  meta: { lineHeight: 18 },
  mission: { fontWeight: '700', lineHeight: 22 },
});
