import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { radius, spacing } from '@/theme/tokens';
import type { Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import type { ChatMessage } from '../useChat';
import { HELP_NOTICE } from '../crisis';

// Acha links (https://... ou gov.br/...) para deixar tocáveis.
const LINK_RE = /(https?:\/\/[^\s)]+|gov\.br\/[^\s)]+)/g;

function renderWithLinks(
  text: string,
  mine: boolean,
  styles: ReturnType<typeof makeStyles>,
) {
  return text.split(LINK_RE).map((part, i) => {
    if (i % 2 === 0) return part; // trechos ímpares são os links capturados
    const url = part.replace(/[.,!?]+$/, '');
    const href = url.startsWith('http') ? url : `https://${url}`;
    return (
      <Text
        key={i}
        style={[styles.link, mine && styles.textMine]}
        onPress={() => Linking.openURL(href)}
        accessibilityRole="link"
      >
        {part}
      </Text>
    );
  });
}

type Props = { message: ChatMessage; isLatest: boolean; onRetry?: (id: string) => void };

export function MessageBubble({ message, isLatest, onRetry }: Props) {
  const styles = useThemedStyles(makeStyles);
  const mine = message.role === 'user';
  return (
    <View
      style={[styles.bubble, mine ? styles.mine : styles.theirs, message.failed && styles.failed]}
      accessible
      accessibilityLabel={`${mine ? 'Você' : 'Rô'}: ${message.showHelp ? `${HELP_NOTICE}. ` : ''}${message.content}`}
      // Leitor de tela anuncia a resposta nova do Rô sem precisar navegar até ela.
      accessibilityLiveRegion={isLatest && !mine ? 'polite' : 'none'}
    >
      {message.offline && (
        <Text style={styles.offline}>
          📵 Você está sem conexão. Esta é uma resposta automática, não da IA.
        </Text>
      )}
      {message.showHelp && (
        <Text style={styles.help}>{renderWithLinks(HELP_NOTICE, false, styles)}</Text>
      )}
      <Text style={[styles.text, mine && styles.textMine]}>
        {renderWithLinks(message.content, mine, styles)}
      </Text>
      {message.failed && onRetry && (
        <Pressable
          style={styles.retry}
          onPress={() => onRetry(message.id)}
          accessibilityRole="button"
          accessibilityLabel="Tentar de novo"
          hitSlop={8}
        >
          <Text style={styles.retryTxt}>↻ Tentar de novo</Text>
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  bubble: {
    maxWidth: '85%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.brand, borderBottomRightRadius: 4 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.bg, borderBottomLeftRadius: 4 },
  text: { fontSize: fs(16), lineHeight: fs(23), color: colors.ink },
  textMine: { color: '#fff' },
  failed: { backgroundColor: '#fff4f1', borderWidth: 1, borderColor: colors.danger },
  offline: {
    fontSize: fs(13),
    fontWeight: '600',
    color: colors.muted,
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  retry: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.danger,
  },
  retryTxt: { color: '#fff', fontWeight: '700', fontSize: fs(15) },
  help: {
    fontSize: fs(14),
    lineHeight: fs(20),
    color: colors.ink,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  link: { color: colors.brand, textDecorationLine: 'underline' },
});
