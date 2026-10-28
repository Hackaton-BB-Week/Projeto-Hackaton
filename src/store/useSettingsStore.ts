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
  // Padrão: segue o celular (claro ou escuro). Ao mexer no interruptor, vale a escolha da pessoa.
  themeMode: 'system' as ThemeMode,
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
      // v2: volta a seguir o celular por padrão (a v1 forçava o claro).
      version: 2,
      migrate: (saved, version) => {
        const s = saved as Partial<SettingsState>;
        if (version < 2) s.themeMode = 'system';
        return s as SettingsState;
      },
    },
  ),
);
