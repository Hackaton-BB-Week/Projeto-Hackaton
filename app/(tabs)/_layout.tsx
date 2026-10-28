import type { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

function icon(name: ComponentProps<typeof Feather>['name']) {
  return function TabIcon({ color, size }: { color: string; size: number }) {
    return <Feather name={name} color={color} size={size} />;
  };
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: icon('home') }} />
      <Tabs.Screen
        name="chat"
        options={{ title: 'Conversar', tabBarIcon: icon('message-circle') }}
      />
      <Tabs.Screen name="ajuda" options={{ title: 'Ajuda', tabBarIcon: icon('life-buoy') }} />
    </Tabs>
  );
}
