import type { ComponentProps } from 'react';
import type { Href } from 'expo-router';
import type { Feather } from '@expo/vector-icons';

// Itens do menu lateral (seções e ordem do protótipo).
// Para ligar um item a uma tela nova, troque `href: null` pela rota.
// Itens com `href: null` aparecem como "Em breve".

export type MenuItem = {
  id: string;
  label: string;
  icon: ComponentProps<typeof Feather>['name'];
  href: Href | null;
};

export type MenuSection = { title: string; items: MenuItem[] };

export const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Ferramentas de apoio',
    items: [
      // Rota /pre-jogo pronta na branch feat/pre-jogo (aguardando merge).
      { id: 'prejogo', label: 'Modo pré-jogo', icon: 'shield', href: null },
      // Abre a aba Ajuda; com feat/pre-jogo mergeada, já abre o exercício direto.
      { id: 'respiracao', label: 'Respiração guiada', icon: 'wind', href: '/ajuda?respirar=1' },
      { id: 'chat', label: 'Conversar com a Rô', icon: 'message-circle', href: '/chat' },
      { id: 'financeiro', label: 'Painel financeiro', icon: 'credit-card', href: '/financeiro' },
      { id: 'missoes', label: 'Missões do dia', icon: 'target', href: '/missoes' },
      { id: 'escolha', label: 'Aposta ou Escolha?', icon: 'check-square', href: null },
      { id: 'diagnostico', label: 'Refazer diagnóstico', icon: 'compass', href: null },
      { id: 'ajuda', label: 'Ajuda e recursos', icon: 'life-buoy', href: '/ajuda' },
    ],
  },
  {
    title: 'Configurações',
    items: [{ id: 'configuracoes', label: 'Configurações', icon: 'sliders', href: null }],
  },
];
