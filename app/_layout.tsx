import { useEffect, useMemo } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastHost } from '@/components/Toast';
import { SideMenu } from '@/features/menu/SideMenu';
import { useTheme } from '@/theme/useTheme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colors, isDark } = useTheme();

  // Fundo nativo da janela com a cor do tema: sem flash branco ao abrir o teclado
  // ou durante transições no modo escuro.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.bg).catch(() => {});
  }, [colors.bg]);

  // A navegação usa as cores do tema (o padrão dela é branco).
  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.bg,
        card: colors.surface,
        border: colors.line,
        text: colors.ink,
        primary: colors.brand,
      },
    };
  }, [isDark, colors]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ThemeProvider value={navTheme}>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="obra"
              // Sem animação da rota: o painel da obra anima sozinho (fundo + deslize).
              options={{
                presentation: 'transparentModal',
                animation: 'none',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            />
          </Stack>
          <SideMenu />
          <ToastHost />
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
