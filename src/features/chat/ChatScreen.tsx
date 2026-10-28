import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing } from '@/theme/tokens';
import { useTheme, type Theme } from '@/theme/useTheme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { useChat } from './useChat';
import { MessageBubble } from './components/MessageBubble';
import { CrisisCard } from './components/CrisisCard';

export function ChatScreen() {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const { messages, status, sending, online, send, retry, showCrisis, hideCrisis } = useChat();
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length, sending]);

  const submit = () => {
    if (!draft.trim() || sending) return;
    send(draft);
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.c} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.h} accessibilityRole="header">
          Rô, sua companhia
        </Text>
        <Text style={styles.disclaimer}>
          Apoio sem julgamento. Não substitui ajuda profissional. Não compartilhe dados pessoais.
          Em crise, ligue 188.
        </Text>
      </View>

      {!online && (
        <View style={styles.offlineBar} accessibilityRole="alert">
          <Text style={styles.offlineTxt}>
            📵 Sem internet. O Rô precisa de conexão para responder com IA.
          </Text>
        </View>
      )}

      {showCrisis && <CrisisCard onClose={hideCrisis} />}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={listRef}
          style={styles.flex}
          contentContainerStyle={styles.list}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item, index }) => (
            <MessageBubble
              message={item}
              isLatest={index === messages.length - 1}
              onRetry={retry}
            />
          )}
          ListFooterComponent={
            status !== 'idle' ? (
              <View style={styles.typing} accessibilityLiveRegion="polite">
                <ActivityIndicator color={colors.brand} />
                <Text style={styles.typingTxt}>
                  {status === 'waiting'
                    ? 'Sem conexão. Aguardando a internet voltar…'
                    : 'Rô está escrevendo…'}
                </Text>
              </View>
            ) : null
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Escreva o que está sentindo…"
            placeholderTextColor={colors.faint}
            multiline
            maxLength={1500}
            onSubmitEditing={submit}
            blurOnSubmit={false}
            accessibilityLabel="Mensagem para o Rô"
          />
          <Pressable
            style={[styles.send, (!draft.trim() || sending) && styles.sendOff]}
            onPress={submit}
            disabled={!draft.trim() || sending}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem"
          >
            <Text style={styles.sendTxt}>Enviar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = ({ colors, fs }: Theme) =>
  StyleSheet.create({
  c: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  h: { fontSize: fs(20), fontWeight: '700', color: colors.ink },
  disclaimer: { fontSize: fs(13), lineHeight: fs(18), color: colors.muted },
  list: { padding: spacing.md, gap: spacing.sm },
  offlineBar: { backgroundColor: colors.danger, paddingVertical: 6, paddingHorizontal: spacing.lg },
  offlineTxt: { color: '#fff', fontSize: fs(13), fontWeight: '600' },
  typing: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: 4 },
  typingTxt: { color: colors.muted, fontSize: fs(14) },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: fs(16),
    color: colors.ink,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
  },
  send: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.gold,
  },
  sendOff: { opacity: 0.5 },
  sendTxt: { color: colors.goldInk, fontWeight: '700', fontSize: fs(15) },
});
