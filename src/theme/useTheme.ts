import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { FONT_SCALE, getPalette } from './themes';

const DARK_MODE_ENABLED = false;

/** Acompanha "Reduzir movimento" do sistema operacional. */
function useSystemReduceMotion() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setEnabled)
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setEnabled);
    return () => sub.remove();
  }, []);
  return enabled;
}

/**
 * Tema atual: cores, escala de fonte e se animações devem ser evitadas.
 * `fs(14)` aplica o tamanho de fonte escolhido no app (a escala do sistema já
 * é aplicada pelo próprio <Text>).
 */
export function useTheme() {
  const scheme = useColorScheme();
  const { themeMode, fontSize, colorblind, reduceMotion } = useSettingsStore();
  const systemReduceMotion = useSystemReduceMotion();

  // Por enquanto o app é só claro. Para reativar o modo escuro, troque para true.
  const isDark =
    DARK_MODE_ENABLED && (themeMode === 'system' ? scheme === 'dark' : themeMode === 'dark');

  return useMemo(() => {
    const scale = FONT_SCALE[fontSize];
    return {
      colors: getPalette(isDark, colorblind),
      isDark,
      reduceMotion: reduceMotion || systemReduceMotion,
      fs: (size: number) => Math.round(size * scale * 10) / 10,
    };
  }, [isDark, colorblind, fontSize, reduceMotion, systemReduceMotion]);
}

export type Theme = ReturnType<typeof useTheme>;
