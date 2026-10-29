import { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomPanel } from '@/components/BottomPanel';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme/useTheme';
import type { Mission } from '../missions';
import { useMissionCamera } from '../useMissionCamera';

type Props = {
  mission: Mission | null;
  onClose: () => void;
  /** Conclui a missão. `photoUri` vem só se a pessoa tirou a foto. */
  onConfirm: (photoUri?: string) => void;
};

// Ao concluir uma missão: convida a registrar o momento com uma foto (opcional).
// A foto não é checada por nada; ela fica só no aparelho.
export function MissionPhotoPanel({ mission, onClose, onConfirm }: Props) {
  const { colors, fs } = useTheme();
  const { takePhoto, busy, openSettings } = useMissionCamera();
  const [photo, setPhoto] = useState<string | null>(null);
  const [denied, setDenied] = useState<null | { canAskAgain: boolean }>(null);
  const [failed, setFailed] = useState(false);

  // Painel novo, estado novo.
  useEffect(() => {
    setPhoto(null);
    setDenied(null);
    setFailed(false);
  }, [mission?.id]);

  const shoot = async () => {
    setFailed(false);
    const r = await takePhoto();
    if (r.status === 'photo') {
      setDenied(null);
      setPhoto(r.uri);
    } else if (r.status === 'denied') setDenied({ canAskAgain: r.canAskAgain });
    else if (r.status === 'error') setFailed(true);
  };

  const sub = [styles.sub, { color: colors.muted, fontSize: fs(14), lineHeight: fs(21) }];

  return (
    <BottomPanel
      visible={mission !== null}
      title={photo ? 'Ficou ótima!' : 'Missão concluída?'}
      onClose={onClose}
    >
      {mission && (
        <>
          <View
            style={[styles.mission, { backgroundColor: colors.surface, borderColor: colors.line }]}
          >
            <View style={[styles.icon, { backgroundColor: colors.brandSoft }]}>
              <Feather name={mission.icon} size={20} color={colors.brand} />
            </View>
            <Text style={[styles.mt, { color: colors.ink, fontSize: fs(15) }]}>
              {mission.title}
            </Text>
          </View>

          {photo ? (
            <>
              <Image
                source={{ uri: photo }}
                style={[styles.photo, { backgroundColor: colors.surface2 }]}
                resizeMode="cover"
                accessibilityLabel={`Foto da missão ${mission.title}`}
              />
              <Button
                label={`Ok, concluir · +${mission.reward} moedas`}
                icon="check"
                onPress={() => onConfirm(photo)}
              />
              <Button
                label="Tirar outra"
                variant="outline"
                icon="camera"
                onPress={shoot}
                disabled={busy}
              />
            </>
          ) : (
            <>
              <Text style={sub}>
                Que tal registrar esse momento com uma foto? Por exemplo, você no parque depois da
                caminhada. É opcional e a foto fica só no seu aparelho.
              </Text>

              {denied && (
                <View
                  style={[styles.notice, { backgroundColor: colors.surface2 }]}
                  accessibilityRole="alert"
                >
                  <Text style={[styles.noticeTxt, { color: colors.ink, fontSize: fs(13.5) }]}>
                    {denied.canAskAgain
                      ? 'Sem acesso à câmera. Tudo bem, dá para concluir sem foto.'
                      : 'O acesso à câmera está bloqueado. Você pode liberar nas configurações do celular, ou concluir sem foto.'}
                  </Text>
                  {!denied.canAskAgain && (
                    <Button
                      label="Abrir configurações"
                      variant="ghost"
                      small
                      onPress={openSettings}
                    />
                  )}
                </View>
              )}
              {failed && (
                <Text
                  style={[styles.noticeTxt, { color: colors.danger, fontSize: fs(13.5) }]}
                  accessibilityRole="alert"
                >
                  Não deu para abrir a câmera agora. Você pode tentar de novo ou concluir sem foto.
                </Text>
              )}

              <Button
                label={busy ? 'Abrindo a câmera…' : 'Tirar foto'}
                icon="camera"
                onPress={shoot}
                disabled={busy}
                accessibilityHint="Pede acesso à câmera para registrar a missão"
              />
              <Button
                label={`Concluir sem foto · +${mission.reward} moedas`}
                variant="outline"
                onPress={() => onConfirm()}
              />
            </>
          )}
        </>
      )}
    </BottomPanel>
  );
}

const styles = StyleSheet.create({
  sub: {},
  mission: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mt: { flex: 1, fontWeight: '700' },
  photo: { width: '100%', aspectRatio: 3 / 4, maxHeight: 360, borderRadius: 16 },
  notice: { borderRadius: 12, padding: 12, gap: 4 },
  noticeTxt: { lineHeight: 19 },
});
