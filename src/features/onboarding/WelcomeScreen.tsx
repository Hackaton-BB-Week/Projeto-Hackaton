import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  useFonts,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import { spacing } from '@/theme/tokens';
import { useTheme, type Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { TextField } from './components/TextField';
import { OnboardingButton } from './components/OnboardingButton';
import { HeroScene } from './components/welcome/HeroScene';
import { NightGradient, SproutIcon } from './components/welcome/art';
import { WelcomeCta } from './components/welcome/WelcomeCta';
import { useOnboarding } from './useOnboarding';
import { validateEmail, validateName, validatePassword } from './validation';

// Boas-vindas + conta (nome, e-mail e senha) ou entrada numa conta existente. Visual de #obWelcome no protótipo
// com a cena de abertura (moeda, girassol e casinhas da vila).
export function WelcomeScreen() {
  const styles = useThemedStyles(makeStyles);
  const { submitIdentity, login, startDemo } = useOnboarding();
  const { reduceMotion } = useTheme();
  const [fontsLoaded] = useFonts({ BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{
    name: string | null;
    email: string | null;
    password: string | null;
  }>({ name: null, email: null, password: null });

  const isLogin = mode === 'login';

  const submit = async () => {
    if (busy) return;
    const e = {
      name: isLogin ? null : validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(e);
    if (e.name || e.email || e.password) return;
    setBusy(true);
    const error = isLogin
      ? await login(email, password)
      : await submitIdentity(name, email, password);
    setBusy(false);
    if (error) setErrors({ ...e, password: error });
  };

  const switchMode = () => {
    setMode(isLogin ? 'signup' : 'login');
    setErrors({ name: null, email: null, password: null });
  };

  // Entradas suaves; sem animação quando "reduzir animações" está ativo.
  const enter = (anim: typeof FadeIn | typeof FadeInDown | typeof FadeInUp, delay: number) =>
    reduceMotion ? undefined : anim.delay(delay).duration(550);
  const display = fontsLoaded ? styles.displayFont : null;
  const displayBold = fontsLoaded ? styles.displayFontBold : null;

  return (
    <View style={styles.c}>
      <View style={StyleSheet.absoluteFill}>
        <NightGradient />
      </View>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <Animated.View entering={enter(FadeIn, 0)} style={styles.brand}>
              <View style={styles.mark}>
                <SproutIcon size={24} />
              </View>
              <Text style={[styles.brandName, displayBold]}>Rolê que Rende</Text>
            </Animated.View>

            <View style={styles.hero}>
              <HeroScene reduceMotion={reduceMotion} />
              <Animated.Text
                entering={enter(FadeInDown, 900)}
                style={[styles.h1, display]}
                accessibilityRole="header"
              >
                Cada dia sem apostar reconstrói um pedaço da sua cidade.
              </Animated.Text>
              <Animated.Text entering={enter(FadeInDown, 1050)} style={styles.lead}>
                Transforme o dinheiro e o tempo das apostas em progresso de verdade. No seu ritmo,
                sem cobrança.
              </Animated.Text>
            </View>

            <Animated.View entering={enter(FadeInUp, 1200)} style={styles.form}>
              {!isLogin && (
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
              )}
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
                returnKeyType="next"
              />
              <TextField
                label={isLogin ? 'Sua senha' : 'Crie uma senha'}
                placeholder="Pelo menos 6 caracteres"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
                autoCapitalize="none"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                textContentType={isLogin ? 'password' : 'newPassword'}
                returnKeyType="done"
                onSubmitEditing={submit}
              />
              <WelcomeCta
                label={busy ? 'Aguarde…' : isLogin ? 'Entrar' : 'Começar minha jornada'}
                onPress={submit}
              />
              <OnboardingButton
                label={isLogin ? 'Criar uma conta' : 'Já tenho conta'}
                variant="ghost"
                onPress={switchMode}
              />
              <OnboardingButton
                label="Explorar demonstração"
                variant="ghost"
                onPress={() => startDemo(name)}
              />
              <Text style={styles.note}>
                O Rolê que Rende é um apoio para desenvolver uma relação mais consciente com as
                apostas. Ele não substitui acompanhamento profissional.
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
    c: { flex: 1, backgroundColor: '#0f2353' },
    flex: { flex: 1 },
    scroll: { flexGrow: 1 },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    mark: {
      width: 48,
      height: 48,
      borderRadius: 15,
      backgroundColor: colors.gold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandName: { color: '#fff', fontSize: fs(20), fontWeight: '800', letterSpacing: -0.6 },
    hero: {
      flex: 1,
      justifyContent: 'center',
      gap: 18,
      paddingHorizontal: spacing.lg,
      paddingVertical: 20,
    },
    h1: {
      color: '#fff',
      fontSize: fs(31),
      fontWeight: '800',
      lineHeight: fs(35),
      letterSpacing: -0.8,
    },
    displayFont: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontWeight: 'normal' },
    displayFontBold: { fontFamily: 'BricolageGrotesque_700Bold', fontWeight: 'normal' },
    lead: { color: '#bcd0f5', fontSize: fs(14.5), lineHeight: fs(23) },
    form: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: spacing.lg,
      paddingTop: 26,
      paddingBottom: 28,
      gap: 4,
    },
    note: {
      fontSize: fs(12),
      color: colors.faint,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: fs(18),
    },
  });
