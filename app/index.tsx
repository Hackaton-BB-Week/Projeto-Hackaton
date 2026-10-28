import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { colors } from '@/theme/tokens';

// Entrada do app: espera ler o login salvo e decide para onde ir.
export default function Entry() {
  const hydrated = useUserStore((s) => s.hydrated);
  const onboarded = useUserStore((s) => s.onboarded);

  if (!hydrated) {
    return (
      <View style={styles.c}>
        <ActivityIndicator color={colors.gold} accessibilityLabel="Carregando" />
      </View>
    );
  }
  return <Redirect href={onboarded ? '/(tabs)' : '/onboarding'} />;
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#1a3c86', alignItems: 'center', justifyContent: 'center' },
});
