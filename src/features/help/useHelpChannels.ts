import { useCallback } from 'react';
import { Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchHelpChannels, logBreathingSession } from '@/services/help';
import { showToast } from '@/components/Toast';
import { LOCAL_HELP_CHANNELS } from './channels';

/**
 * Canais de apoio. Começa com a lista embutida (aparece na hora, inclusive offline)
 * e troca pela versão do Supabase quando ela chegar. Em erro, mantém a embutida.
 */
export function useHelpChannels() {
  const { data } = useQuery({
    queryKey: ['help-channels'],
    queryFn: fetchHelpChannels,
    initialData: LOCAL_HELP_CHANNELS,
    initialDataUpdatedAt: 0, // trata a lista embutida como "velha" → busca ao abrir
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
  return data;
}

/** Ações de um canal com telefone: copiar e ligar, sempre com retorno ao usuário. */
export function useChannelActions() {
  const copy = useCallback(async (phone: string) => {
    try {
      await Clipboard.setStringAsync(phone);
      showToast(`Número ${phone} copiado`);
    } catch {
      showToast(`Número: ${phone}`);
    }
  }, []);

  const call = useCallback(async (phone: string) => {
    try {
      await Linking.openURL(`tel:${phone}`);
    } catch {
      showToast(`Não deu para abrir o discador. Ligue ${phone}.`);
    }
  }, []);

  return { copy, call };
}

/** Salva um exercício concluído (silencioso: falhar aqui não atrapalha o usuário). */
export function useLogBreathing() {
  const { mutate } = useMutation({
    mutationFn: logBreathingSession,
    onError: (e) => {
      if (__DEV__) console.warn('[ajuda] não foi possível registrar a respiração:', e);
    },
  });
  return mutate;
}
