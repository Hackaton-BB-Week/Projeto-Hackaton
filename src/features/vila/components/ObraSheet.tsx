import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSwipeToClose } from '@/hooks/useSwipeToClose';
import { styleOptionsFor, type Plot } from '../data/cities';
import { BuildingPreview } from '../scene/CityScene';
import { isAvailable, type BuiltMap } from '@/store/useVilaStore';
import { radius, spacing } from '@/theme/tokens';
import type { Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';

interface Props {
  plot: Plot;
  built: BuiltMap;
  coins: number;
  onBuild: (plotId: string, style: number) => void;
  onClose: () => void;
  /** Espaço da barra de navegação do sistema, embaixo do painel. */
  bottomInset?: number;
}

// Painel de uma obra: estado, benefício, custo, requisito, estilo e botão de construir.
// Aparece por cima do app pela rota app/obra.tsx (apresentação transparentModal).
export default function ObraSheet({
  plot,
  built,
  coins,
  onBuild,
  onClose,
  bottomInset = 0,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const [style, setStyle] = useState(0);
  // Fecha deslizando para baixo, o mesmo caminho por onde entrou.
  const swipe = useSwipeToClose(onClose);
  useEffect(() => setStyle(0), [plot.id]);

  const done = built[plot.id];
  const available = isAvailable(plot, built);
  const canPay = coins >= plot.cost;
  const options = styleOptionsFor(plot.type);
  const state = done ? 'Concluída' : available ? 'Pronta para construir' : 'Bloqueada';

  return (
    <View style={styles.root}>
      {/* O fundo clareia junto com o arraste. */}
      <Animated.View style={[styles.backdrop, swipe.backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={swipe.dismiss} accessibilityLabel="Fechar painel" />
      </Animated.View>
      <GestureDetector gesture={swipe.gesture}>
      <Animated.View
        onLayout={swipe.onLayout}
        style={[styles.sheet, { paddingBottom: spacing.xl + bottomInset }, swipe.panelStyle]}
        accessibilityViewIsModal
      >
        <View style={styles.grab} />
        <Text style={styles.title} accessibilityRole="header">
          {plot.name}
        </Text>
        <Text style={styles.zone}>{plot.zone}</Text>

        <View style={styles.hero}>
          <BuildingPreview type={plot.type} style={done ? done.style : style} size={100} tight />
        </View>

        <Row k="Estado" v={state} />
        <Row k="Benefício" v={plot.benefit} />
        {!done && <Row k="Custo" v={`${plot.cost} moedas`} />}
        {!done && !available && (
          <Row k="Requisito" v={`Conclua ${plot.unlock} ${plot.unlock === 1 ? 'obra' : 'obras'}`} />
        )}

        {!done && available && plot.hasStyle && (
          <>
            <Text style={styles.eyebrow}>Escolha o estilo</Text>
            <View style={styles.styles} accessibilityRole="radiogroup">
              {options.map((o, i) => (
                <Pressable
                  key={o.name}
                  onPress={() => setStyle(i)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: style === i }}
                  style={[styles.styleOpt, style === i && styles.styleSel]}
                >
                  <View style={[styles.swatch, { backgroundColor: o.color }]} />
                  <Text style={styles.styleTxt}>{o.name}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {!done && available ? (
          <>
            <Button
              primary
              disabled={!canPay}
              label={canPay ? `Construir · ${plot.cost} moedas` : 'Moedas insuficientes'}
              hint={canPay ? undefined : `Você tem ${coins} de ${plot.cost} moedas.`}
              onPress={() => onBuild(plot.id, style)}
            />
            <Button label="Agora não" onPress={swipe.dismiss} />
          </>
        ) : (
          <Button label={done ? 'Fechar' : 'Entendi'} onPress={swipe.dismiss} />
        )}
      </Animated.View>
      </GestureDetector>
    </View>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.row}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.v}>{v}</Text>
    </View>
  );
}

function Button({
  label,
  onPress,
  primary,
  disabled,
  hint,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
  hint?: string;
}) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityHint={hint}
      style={({ pressed }) => [
        styles.btn,
        primary && styles.btnPrimary,
        disabled && styles.btnDisabled,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.btnTxt, primary && styles.btnPrimaryTxt]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { flex: 1, backgroundColor: 'rgba(10,20,40,.45)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  grab: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  title: { fontSize: fs(20), fontWeight: '700', color: colors.ink },
  zone: { fontSize: fs(13), color: colors.muted, marginTop: -6 },
  hero: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  k: { fontSize: fs(14), color: colors.muted },
  v: { fontSize: fs(14), color: colors.ink, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  eyebrow: {
    marginTop: spacing.sm,
    fontSize: fs(12),
    fontWeight: '700',
    color: colors.navy,
    textTransform: 'uppercase',
  },
  styles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  styleOpt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.line,
  },
  styleSel: { borderColor: colors.brand, backgroundColor: colors.bg },
  swatch: { width: 18, height: 18, borderRadius: 9 },
  styleTxt: { fontSize: fs(13), color: colors.ink, fontWeight: '600' },
  btn: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: colors.gold, marginTop: spacing.sm },
  btnDisabled: { backgroundColor: colors.line },
  btnTxt: { fontSize: fs(15), fontWeight: '700', color: colors.muted },
  btnPrimaryTxt: { color: colors.goldInk },
});
