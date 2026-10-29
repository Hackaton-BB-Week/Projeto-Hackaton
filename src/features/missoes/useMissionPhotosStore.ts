import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import type { Mission } from './missions';

// Álbum das missões: fotos tiradas ao concluir uma missão. Ficam só no aparelho
// (pasta do app), nunca vão para servidor. A lista é salva para sobreviver ao fechar o app.

export interface MissionPhoto {
  id: string;
  missionId: string;
  title: string;
  icon: Mission['icon'];
  /** Arquivo na pasta do app. */
  uri: string;
  /** Data/hora em ms. */
  takenAt: number;
}

const DIR = `${FileSystem.documentDirectory}missoes/`;

interface PhotosState {
  photos: MissionPhoto[];
  /** Copia a foto da câmera (pasta temporária) para a pasta do app e guarda no álbum. */
  add: (mission: Mission, tempUri: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useMissionPhotosStore = create<PhotosState>()(
  persist(
    (set, get) => ({
      photos: [],

      add: async (mission, tempUri) => {
        const id = `${Date.now()}-${mission.id}`;
        let uri = tempUri;
        try {
          await FileSystem.makeDirectoryAsync(DIR, { intermediates: true }).catch(() => {});
          uri = `${DIR}${id}.jpg`;
          await FileSystem.copyAsync({ from: tempUri, to: uri });
        } catch {
          uri = tempUri; // se não der para copiar, guarda o caminho original mesmo
        }
        const photo: MissionPhoto = {
          id,
          missionId: mission.id,
          title: mission.title,
          icon: mission.icon,
          uri,
          takenAt: Date.now(),
        };
        set({ photos: [photo, ...get().photos] });
      },

      remove: async (id) => {
        const photo = get().photos.find((p) => p.id === id);
        set({ photos: get().photos.filter((p) => p.id !== id) });
        if (photo?.uri.startsWith(DIR)) {
          await FileSystem.deleteAsync(photo.uri, { idempotent: true }).catch(() => {});
        }
      },
    }),
    { name: 'rqr-mission-photos', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
