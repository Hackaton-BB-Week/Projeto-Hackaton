import { useMemo } from 'react';
import { useTheme, type Theme } from './useTheme';

/**
 * Estilos que seguem as Configurações (modo escuro, daltonismo, tamanho da fonte).
 * Troque `StyleSheet.create({...})` por uma função que recebe o tema:
 *
 *   const makeStyles = ({ colors, fs }: Theme) => StyleSheet.create({ h: { color: colors.ink, fontSize: fs(18) } });
 *   const styles = useThemedStyles(makeStyles); // dentro do componente
 */
export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
