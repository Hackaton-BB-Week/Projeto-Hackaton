import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, type Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';
import { showToast } from '@/components/Toast';
import { MENU_SECTIONS, type MenuItem } from './menuItems';
import { useMenuStore } from './useMenuStore';
import { useDemoActions } from './useDemoActions';

const DURATION = 260;

/** Menu lateral (gaveta da esquerda). Montado uma vez em app/_layout.tsx, por cima de tudo.
 *  Não usa <Modal>: no Android com a nova arquitetura ele abre sem tamanho (só o topo
 *  aparece) e trava os toques. É uma camada absoluta que cobre a tela inteira. */
export function SideMenu() {
  const { colors, fs, reduceMotion } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { open, closeMenu } = useMenuStore();
  const demo = useDemoActions();

  const panelWidth = Math.min(width * 0.84, 322);
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (open) setMounted(true);
    const finish = () => !open && setMounted(false);
    if (reduceMotion) {
      progress.setValue(open ? 1 : 0);
      finish();
      return;
    }
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(finish);
  }, [open, reduceMotion, progress]);

  // "Voltar" do Android fecha o menu (antes isso era feito pelo Modal).
  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closeMenu();
      return true;
    });
    return () => sub.remove();
  }, [open, closeMenu]);

  // O "Reiniciar" pede um segundo toque; volta ao normal depois de alguns segundos.
  useEffect(() => {
    if (!confirmReset) return;
    const t = setTimeout(() => setConfirmReset(false), 4000);
    return () => clearTimeout(t);
  }, [confirmReset]);

  const goTo = (href: Href) => {
    closeMenu();
    // Espera a gaveta fechar antes de trocar de tela.
    setTimeout(() => router.push(href), reduceMotion ? 0 : DURATION);
  };

  const onItem = (item: MenuItem) => {
    if (item.href) goTo(item.href);
    else showToast(`${item.label}: em breve`);
  };

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-panelWidth, 0] });

  if (!mounted) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, { opacity: progress }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeMenu}
          accessibilityRole="button"
          accessibilityLabel="Fechar menu"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          {
            width: panelWidth,
            backgroundColor: colors.bg,
            paddingTop: insets.top,
            transform: [{ translateX }],
          },
        ]}
        accessibilityViewIsModal
      >
        <View style={styles.head}>
          <View style={[styles.logo, { backgroundColor: colors.gold }]}>
            <Feather name="feather" size={20} color={colors.goldInk} />
          </View>
          <Text
            style={[styles.title, { color: colors.ink, fontSize: fs(17) }]}
            accessibilityRole="header"
          >
            Menu
          </Text>
          <Pressable
            onPress={closeMenu}
            style={[styles.close, { backgroundColor: colors.surface2 }]}
            accessibilityRole="button"
            accessibilityLabel="Fechar menu"
          >
            <Feather name="x" size={20} color={colors.ink} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          {MENU_SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text
                style={[styles.label, { color: colors.muted, fontSize: fs(12) }]}
                accessibilityRole="header"
              >
                {section.title}
              </Text>
              {section.items.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => onItem(item)}
                  style={({ pressed }) => [
                    styles.item,
                    pressed && { backgroundColor: colors.surface },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={item.href ? item.label : `${item.label}, em breve`}
                >
                  <View
                    style={[
                      styles.itemIcon,
                      { backgroundColor: colors.surface, shadowColor: colors.shadow },
                    ]}
                  >
                    <Feather
                      name={item.icon}
                      size={19}
                      color={item.href ? colors.brand : colors.faint}
                    />
                  </View>
                  <Text
                    style={[
                      styles.itemTxt,
                      { color: item.href ? colors.ink : colors.muted, fontSize: fs(14.5) },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {!item.href && (
                    <View style={[styles.soon, { backgroundColor: colors.surface2 }]}>
                      <Text style={[styles.soonTxt, { color: colors.muted, fontSize: fs(10.5) }]}>
                        Em breve
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          ))}

          <View style={styles.section}>
            <Text
              style={[styles.label, { color: colors.muted, fontSize: fs(12) }]}
              accessibilityRole="header"
            >
              Demonstração
            </Text>
            <View style={styles.demo}>
              {[
                { label: 'Simular +1 dia', onPress: () => demo.addDays(1) },
                { label: 'Simular +7 dias', onPress: () => demo.addDays(7) },
                { label: '+300 moedas', onPress: () => demo.addCoins(300) },
                {
                  label: confirmReset ? 'Toque de novo para reiniciar' : 'Reiniciar',
                  danger: confirmReset,
                  hint: 'Apaga o login e o progresso. Pede confirmação.',
                  onPress: () => {
                    if (!confirmReset) return setConfirmReset(true);
                    setConfirmReset(false);
                    closeMenu();
                    demo.resetAll();
                  },
                },
              ].map((b) => (
                <Pressable
                  key={b.label}
                  onPress={b.onPress}
                  style={({ pressed }) => [
                    styles.demoBtn,
                    {
                      backgroundColor: b.danger ? colors.dangerSoft : colors.surface,
                      borderColor: b.danger ? colors.danger : colors.line,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                  accessibilityRole="button"
                  accessibilityHint={b.hint}
                >
                  <Text
                    style={[
                      styles.demoTxt,
                      { color: b.danger ? colors.danger : colors.ink, fontSize: fs(12.5) },
                    ]}
                  >
                    {b.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, elevation: 100 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(6,16,40,0.5)' },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    shadowColor: '#040e28',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 8, height: 0 },
    elevation: 16,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 18, paddingBottom: 10 },
  logo: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontWeight: '700' },
  close: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { paddingHorizontal: 12, paddingVertical: 6 },
  label: { fontWeight: '700', paddingTop: 12, paddingBottom: 6, paddingHorizontal: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    minHeight: 52,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 13,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  itemTxt: { flex: 1, fontWeight: '600' },
  soon: { borderRadius: 999, paddingVertical: 3, paddingHorizontal: 8 },
  soonTxt: { fontWeight: '700' },
  demo: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, paddingHorizontal: 10, paddingTop: 4 },
  demoBtn: {
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 11,
  },
  demoTxt: { fontWeight: '600' },
});
