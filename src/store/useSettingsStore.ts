import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FontSize } from '@/theme/themes';

// Preferências de aparência e acessibilidade (salvas no aparelho).
// A tela de Configurações vai editar isto; o resto do app só lê via `useTheme()`.

export type ThemeMode = 'system' | 'light' | 'dark';

interface SettingsState {
  themeMode: ThemeMode;
  fontSize: FontSize;
  colorblind: boolean;
  /** Preferência do app; o `useTheme` também respeita a configuração do sistema. */
  reduceMotion: boolean;

  setThemeMode: (m: ThemeMode) => void;
  setFontSize: (f: FontSize) => void;
  setColorblind: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
  reset: () => void;
}

const DEFAULTS = {
  themeMode: 'light' as ThemeMode,
  fontSize: 'default' as FontSize,
  colorblind: false,
  reduceMotion: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setThemeMode: (themeMode) => set({ themeMode }),
      setFontSize: (fontSize) => set({ fontSize }),
      setColorblind: (colorblind) => set({ colorblind }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'rqr-settings',
      storage: createJSONStorage(() => AsyncStorage),
      // v1: o app passa a abrir claro; quem tinha "seguir o sistema" salvo começa no claro.
      version: 1,
      migrate: (saved, version) => {
        const s = saved as Partial<SettingsState>;
        if (version < 1 && s.themeMode === 'system') s.themeMode = 'light';
        return s as SettingsState;
      },
    },
  ),
);
