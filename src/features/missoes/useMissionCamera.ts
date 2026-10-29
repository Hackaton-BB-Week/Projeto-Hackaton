import { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export type CameraResult =
  | { status: 'photo'; uri: string }
  | { status: 'cancelled' }
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'error' };

/**
 * Tira uma foto com a câmera do aparelho. Pede a permissão na hora (só quando a
 * pessoa toca em "Tirar foto"). A foto não é analisada por nada.
 */
export function useMissionCamera() {
  const [busy, setBusy] = useState(false);

  const takePhoto = useCallback(async (): Promise<CameraResult> => {
    setBusy(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return { status: 'denied', canAskAgain: perm.canAskAgain };
      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.6, // leve: a foto fica no aparelho
        allowsEditing: false,
      });
      if (res.canceled || !res.assets?.[0]?.uri) return { status: 'cancelled' };
      return { status: 'photo', uri: res.assets[0].uri };
    } catch {
      return { status: 'error' };
    } finally {
      setBusy(false);
    }
  }, []);

  /** Abre as configurações do app, para quem negou a câmera e quer liberar depois. */
  const openSettings = useCallback(() => Linking.openSettings().catch(() => {}), []);

  return { takePhoto, busy, openSettings };
}
