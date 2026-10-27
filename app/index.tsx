import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/theme/tokens';

// Tela de boas-vindas (stub). Implementar formulário em src/features/onboarding.
export default function Welcome() {
  return (
    <View style={styles.c}>
      <Text style={styles.h1}>Rolê que Rende</Text>
      <Text style={styles.p}>
        Cada dia sem apostar vira moeda pra reconstruir sua vila.
      </Text>
      <Pressable style={styles.btn} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.btnTxt}>Começar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.navy, padding: 24, justifyContent: 'center', gap: 16 },
  h1: { color: '#fff', fontSize: 30, fontWeight: '700' },
  p: { color: '#bcd0f5', fontSize: 15, lineHeight: 22 },
  btn: { backgroundColor: colors.gold, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnTxt: { color: colors.goldInk, fontWeight: '700', fontSize: 15 },
});
