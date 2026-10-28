import { Stack } from 'expo-router';

// Fluxo de entrada: boas-vindas → pesquisa → ponto de partida.
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
