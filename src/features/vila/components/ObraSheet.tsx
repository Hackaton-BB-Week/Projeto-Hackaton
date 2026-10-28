import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { styleOptionsFor, type Plot } from '../data/cities';
import { BuildingPreview } from '../scene/CityScene';
import { isAvailable, type BuiltMap } from '@/store/useVilaStore';
import { colors, radius, spacing } from '@/theme/tokens';

interface Props {
  plot: Plot | null;
  built: BuiltMap;
  coins: number;
  onBuild: (plotId: string, style: number) => void;
  onClose: () => void;
}

// Painel de uma obra: estado, benefício, custo, requisito, estilo e botão de construir.
export default function ObraSheet({ plot, built, coins, onBuild, onClose }: Props) {
  const [style, setStyle] = useState(0);
  useEffect(() => setStyle(0), [plot?.id]);

  if (!plot) return null;
  const done = built[plot.id];
  const available = isAvailable(plot, built);
  const canPay = coins >= plot.cost;
  const options = styleOptionsFor(plot.type);
  const state = done ? 'Concluída' : available ? 'Pronta para construir' : 'Bloqueada';

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar painel" />
      <View style={styles.sheet} accessibilityViewIsModal>
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
            <Button label="Agora não" onPress={onClose} />
          </>
        ) : (
          <Button label={done ? 'Fechar' : 'Entendi'} onPress={onClose} />
        )}
      </View>
    </Modal>
  );
}

function Row({ k, v }: { k: string; v: string }) {
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

const styles = StyleSheet.create({
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
  title: { fontSize: 20, fontWeight: '700', color: colors.ink },
  zone: { fontSize: 13, color: colors.muted, marginTop: -6 },
  hero: {
    alignItems: 'center',
    backgroundColor: colors.sky,
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
  k: { fontSize: 14, color: colors.muted },
  v: { fontSize: 14, color: colors.ink, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  eyebrow: {
    marginTop: spacing.sm,
    fontSize: 12,
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
  styleSel: { borderColor: colors.blue, backgroundColor: colors.sky },
  swatch: { width: 18, height: 18, borderRadius: 9 },
  styleTxt: { fontSize: 13, color: colors.ink, fontWeight: '600' },
  btn: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: colors.gold, marginTop: spacing.sm },
  btnDisabled: { backgroundColor: colors.line },
  btnTxt: { fontSize: 15, fontWeight: '700', color: colors.muted },
  btnPrimaryTxt: { color: colors.goldInk },
});
