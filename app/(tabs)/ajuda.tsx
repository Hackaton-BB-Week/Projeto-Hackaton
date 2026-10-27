import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

// Ajuda / SOS (stub). Canais reais em src/features/help.
export default function Ajuda() {
  return (
    <View style={styles.c}>
      <Text style={styles.h}>Canais de ajuda</Text>
      <Text style={styles.p}>CVV 188 · CAPS · Jogadores Anônimos</Text>
      <Text style={styles.note}>Apoio complementar — não substitui atendimento de saúde.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.sky, padding: 20, gap: 8, justifyContent: 'center' },
  h: { fontSize: 22, fontWeight: '700', color: colors.ink },
  p: { fontSize: 15, color: colors.ink },
  note: { fontSize: 12, color: colors.faint },
});
