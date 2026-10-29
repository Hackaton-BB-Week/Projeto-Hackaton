# Feature: menu (menu lateral ☰)

Gaveta que abre pela esquerda com as ferramentas de apoio, configurações e
atalhos de demonstração (seções do protótipo).

- `menuItems.ts` — **lista dos itens**. Para ligar uma tela nova, troque `href: null`
  pela rota. Itens sem rota aparecem como "Em breve" (e avisam ao tocar).
- `SideMenu.tsx` — a gaveta. Montada uma vez em `app/_layout.tsx`.
- `MenuButton.tsx` — o botão ☰ (hoje na tela inicial). Pode ser usado em qualquer tela.
- `useMenuStore.ts` — abre/fecha o menu de qualquer lugar: `useMenuStore.getState().openMenu()`.
- `useDemoActions.ts` — simular dias, ganhar moedas e reiniciar (pede 2 toques).

## Pendentes de ligar
| Item | Rota | Onde está |
|---|---|---|
| Modo pré-jogo | `/pre-jogo` | branch `feat/pre-jogo` |
| Missões do dia | `/missoes` | branch `feat/missoes` |
| Aposta ou Escolha? | — | a fazer |
| Refazer diagnóstico | — | a fazer |
| Configurações | — | a fazer (preferências já em `useSettingsStore`) |
