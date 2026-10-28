import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastHost } from '@/components/Toast';
import { SideMenu } from '@/features/menu/SideMenu';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="obra"
            // Sem animação da rota: o painel da obra anima sozinho (fundo + deslize).
            options={{ presentation: 'transparentModal', animation: 'none' }}
          />
        </Stack>
        <SideMenu />
        <ToastHost />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
