import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';
import type { ChatMessage } from '../useChat';
import { HELP_NOTICE } from '../crisis';

// Acha links (https://... ou gov.br/...) para deixar tocáveis.
const LINK_RE = /(https?:\/\/[^\s)]+|gov\.br\/[^\s)]+)/g;

function renderWithLinks(text: string, mine: boolean) {
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
        <Text style={styles.help}>{renderWithLinks(HELP_NOTICE, false)}</Text>
      )}
      <Text style={[styles.text, mine && styles.textMine]}>
        {renderWithLinks(message.content, mine)}
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

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '85%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.blue, borderBottomRightRadius: 4 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.sky, borderBottomLeftRadius: 4 },
  text: { fontSize: 16, lineHeight: 23, color: colors.ink },
  textMine: { color: '#fff' },
  failed: { backgroundColor: '#fff4f1', borderWidth: 1, borderColor: colors.danger },
  offline: {
    fontSize: 13,
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
  retryTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  help: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  link: { color: colors.blue, textDecorationLine: 'underline' },
});
