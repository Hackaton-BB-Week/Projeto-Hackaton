import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme/useTheme';
import type { HelpChannel } from '../channels';
import { useChannelActions } from '../useHelpChannels';

const FEATHER_ICON = { phone: 'phone', hospital: 'plus-square', users: 'users' } as const;

type Props = { channel: HelpChannel; last?: boolean };

export function ChannelItem({ channel, last }: Props) {
  const { colors, fs } = useTheme();
  const { copy, call } = useChannelActions();
  const tone = { danger: colors.danger, green: colors.green600, brand: colors.brand }[channel.tone];
  const { phone } = channel;

  return (
    <View style={[styles.item, !last && { borderBottomWidth: 1, borderBottomColor: colors.line }]}>
      <View style={[styles.icon, { backgroundColor: colors.brandSoft }]}>
        <Feather name={FEATHER_ICON[channel.icon]} size={22} color={tone} />
      </View>
      <View style={styles.body}>
        <Text
          style={[styles.name, { color: colors.ink, fontSize: fs(15) }]}
          accessibilityRole="header"
        >
          {channel.name}
        </Text>
        <Text style={[styles.desc, { color: colors.muted, fontSize: fs(13) }]}>
          {channel.description}
        </Text>
        {phone && (
          <View style={styles.phoneRow}>
            <Button
              small
              variant="navy"
              icon="phone"
              label={`Ligar ${phone}`}
              accessibilityLabel={`Ligar para ${phone}`}
              onPress={() => call(phone)}
            />
            <Button
              small
              variant="outline"
              icon="copy"
              label="Copiar"
              accessibilityLabel={`Copiar o número ${phone}`}
              onPress={() => copy(phone)}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', gap: 14, paddingVertical: 15, alignItems: 'flex-start' },
  icon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 4 },
  name: { fontWeight: '700' },
  desc: { lineHeight: 19 },
  phoneRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
});
