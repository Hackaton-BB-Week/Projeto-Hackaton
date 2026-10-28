import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme/tokens';
import { TextField } from './components/TextField';
import { OnboardingButton } from './components/OnboardingButton';
import { useOnboarding } from './useOnboarding';
import { validateEmail, validateName } from './validation';

// Boas-vindas + login local (nome e e-mail). Visual de #obWelcome no protótipo.
export function WelcomeScreen() {
  const { submitIdentity, startDemo } = useOnboarding();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name: string | null; email: string | null }>({
    name: null,
    email: null,
  });

  const submit = () => {
    const e = { name: validateName(name), email: validateEmail(email) };
    setErrors(e);
    if (!e.name && !e.email) submitIdentity(name, email);
  };

  return (
    <SafeAreaView style={styles.c} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.mark}>
              <View style={styles.leafStem} />
              <View style={styles.leaf} />
            </View>
            <Text style={styles.brandName}>Rolê que Rende</Text>
          </View>

          <View style={styles.hero}>
            <View style={styles.art} accessible={false}>
              <View style={styles.coin}>
                <Text style={styles.coinTxt}>R$</Text>
              </View>
            </View>
            <Text style={styles.h1} accessibilityRole="header">
              Cada dia sem apostar reconstrói um pedaço da sua cidade.
            </Text>
            <Text style={styles.lead}>
              Transforme o dinheiro e o tempo das apostas em progresso de verdade — no seu ritmo,
              sem cobrança.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Como podemos te chamar?"
              placeholder="Seu primeiro nome"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoComplete="given-name"
              textContentType="givenName"
              returnKeyType="next"
            />
            <TextField
              label="Seu e-mail"
              placeholder="voce@email.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            <OnboardingButton label="Começar minha jornada" onPress={submit} />
            <OnboardingButton
              label="Explorar demonstração"
              variant="ghost"
              onPress={() => startDemo(name)}
            />
            <Text style={styles.note}>
              O Rolê que Rende é um apoio para desenvolver uma relação mais consciente com as
              apostas. Ele não substitui acompanhamento profissional.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#1a3c86' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: spacing.lg, paddingBottom: 0 },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafStem: { position: 'absolute', bottom: 10, width: 2.5, height: 14, borderRadius: 2, backgroundColor: colors.goldInk },
  leaf: {
    position: 'absolute',
    top: 10,
    left: 21,
    width: 12,
    height: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 2.5,
    borderColor: colors.goldInk,
  },
  brandName: { color: '#fff', fontSize: 19, fontWeight: '800', letterSpacing: -0.5 },
  hero: { flex: 1, justifyContent: 'center', gap: 16, paddingHorizontal: spacing.lg, paddingVertical: 24 },
  art: { height: 72, alignItems: 'flex-end', justifyContent: 'center' },
  coin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gold,
    borderWidth: 4,
    borderColor: '#ffe79a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinTxt: { color: colors.goldInk, fontWeight: '800', fontSize: 16 },
  h1: { color: '#fff', fontSize: 30, fontWeight: '800', lineHeight: 34, letterSpacing: -0.6 },
  lead: { color: '#bcd0f5', fontSize: 14, lineHeight: 22 },
  form: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: 22,
    paddingBottom: 28,
  },
  note: { fontSize: 12, color: colors.faint, textAlign: 'center', marginTop: 12, lineHeight: 18 },
});
