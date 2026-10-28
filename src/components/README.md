# Componentes de UI reutilizáveis

Todos seguem o tema (`useTheme()` em `src/theme/useTheme.ts`): modo escuro, tamanho de
fonte do app, modo daltonismo e "reduzir animações". Alvos de toque ≥ 44px.

- `Button` — variantes `primary` (amarelo), `outline`, `navy`, `ghost`, `soft`; `small`, `icon` (Feather).
- `Card` — cartão com borda e sombra leve.
- `Sheet` — painel modal que sobe de baixo, com título e botão de fechar.
- `Toast` — `showToast('mensagem')` de qualquer lugar; o `<ToastHost />` está em `app/_layout.tsx`.
- `Eyebrow` — rótulo de seção com tracinho dourado.

Preferências ficam em `src/store/useSettingsStore.ts` (salvas no aparelho); a tela de
Configurações só precisa chamar os setters de lá.
