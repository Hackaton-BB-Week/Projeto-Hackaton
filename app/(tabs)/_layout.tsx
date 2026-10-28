import { Tabs } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.blue }}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="chat" options={{ title: 'Conversar' }} />
      <Tabs.Screen name="ajuda" options={{ title: 'Ajuda' }} />
    </Tabs>
  );
}
