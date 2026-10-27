import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

// Chat "Rô" (stub). MVP: respostas locais; depois usar src/services/ai.ts.
export default function Chat() {
  return (
    <View style={styles.c}>
      <Text style={styles.h}>Rô, sua companhia</Text>
      <Text style={styles.p}>Apoio, sem julgamento.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.surface, padding: 20, gap: 8, justifyContent: 'center' },
  h: { fontSize: 20, fontWeight: '700', color: colors.ink },
  p: { fontSize: 14, color: colors.green600 },
});
