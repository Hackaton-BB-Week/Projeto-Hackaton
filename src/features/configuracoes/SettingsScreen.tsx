import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Eyebrow } from '@/components/Eyebrow';
import { ScreenHeader } from '@/components/ScreenHeader';
import { showToast } from '@/components/Toast';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { FontSize } from '@/theme/themes';
import { useTheme } from '@/theme/useTheme';
import { SettingRow } from './components/SettingRow';
import { SettingSwitch } from './components/SettingSwitch';
import { ColorPreview } from './components/ColorPreview';

const FONT_OPTIONS: { value: FontSize; label: string; a11y: string }[] = [
  { value: 'small', label: 'A-', a11y: 'Fonte pequena' },
  { value: 'default', label: 'A', a11y: 'Fonte padrão' },
  { value: 'large', label: 'A+', a11y: 'Fonte grande' },
];

// Configurações (seção Configurações do protótipo). Cada opção muda o app na hora
// e fica salva no aparelho.
export function SettingsScreen() {
  const { colors, fs, isDark } = useTheme();
  const s = useSettingsStore();
  const followsSystem = s.themeMode === 'system';

  return (
    <SafeAreaView style={[styles.c, { backgroundColor: colors.bg }]} edges={['top', 'bottom']}>
      <ScreenHeader title="Configurações" />
      <ScrollView contentContainerStyle={styles.body}>
        <Eyebrow>Aparência</Eyebrow>
        <Card style={styles.card}>
          <SettingRow
            first
            title="Modo escuro"
            description={
              followsSystem ? 'Seguindo o modo do celular' : 'Tema escuro em todo o app'
            }
          >
            <SettingSwitch
              label="Modo escuro"
              value={isDark}
              onChange={(v) => s.setThemeMode(v ? 'dark' : 'light')}
            />
          </SettingRow>
          <SettingRow title="Tamanho da fonte" description="Textos e botões">
            <View style={styles.seg} accessibilityRole="radiogroup">
              {FONT_OPTIONS.map((o) => {
                const sel = s.fontSize === o.value;
                return (
                  <Pressable
                    key={o.value}
                    onPress={() => s.setFontSize(o.value)}
                    accessibilityRole="radio"
                    accessibilityLabel={o.a11y}
                    accessibilityState={{ checked: sel }}
                    style={[
                      styles.segBtn,
                      {
                        backgroundColor: sel ? colors.brandSoft : colors.surface2,
                        borderColor: sel ? colors.brand : colors.line,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.segTxt,
                        { color: sel ? colors.brand700 : colors.ink, fontSize: fs(14) },
                      ]}
                    >
                      {o.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SettingRow>
        </Card>

        <Eyebrow>Acessibilidade</Eyebrow>
        <Card style={styles.card}>
          <SettingRow
            first
            large
            title="Modo para daltonismo"
            description="Troca verde e vermelho por cores mais fáceis de diferenciar, no app e na vila."
          >
            <SettingSwitch
              label="Modo para daltonismo"
              value={s.colorblind}
              onChange={s.setColorblind}
            />
          </SettingRow>
          <ColorPreview />
          <SettingRow
            large
            title="Reduzir animações"
            description="Desliga movimentos decorativos, como a planta balançando e os painéis deslizando."
          >
            <SettingSwitch
              label="Reduzir animações"
              value={s.reduceMotion}
              onChange={s.setReduceMotion}
            />
          </SettingRow>
        </Card>

        <Button
          label="Restaurar configurações padrão"
          variant="outline"
          onPress={() => {
            s.reset();
            showToast('Configurações restauradas');
          }}
        />
        <Text style={[styles.note, { color: colors.faint, fontSize: fs(12.5) }]}>
          As configurações ficam salvas neste aparelho. Se o celular estiver com "reduzir movimento"
          ligado, o app também respeita.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1 },
  body: { padding: 18, paddingBottom: 32, gap: 12 },
  card: { paddingVertical: 2 },
  seg: { flexDirection: 'row', gap: 6 },
  segBtn: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segTxt: { fontWeight: '800' },
  note: { lineHeight: 18 },
});
