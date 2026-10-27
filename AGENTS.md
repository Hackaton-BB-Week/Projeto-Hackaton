# AGENTS.md — como a IA deve trabalhar neste repositório

Este arquivo orienta assistentes de IA (Claude Code, Cursor, Copilot, etc.).
Leia-o inteiro antes de gerar ou alterar código. `CLAUDE.md` aponta para cá.

## Contexto

App mobile "Rolê que Rende" (hackathon BBDW 2026) para apoiar quem quer repensar
sua relação com apostas. Público amplo; tom acolhedor, nunca moralista. Leia
também `docs/MVP.md`, `docs/GAMIFICACAO.md` e `docs/EDITAL.md`.

## Stack e comandos

- Expo (React Native) + TypeScript + Expo Router.
- Zustand (estado de UI) + TanStack Query (dados do Supabase).
- Supabase (Postgres + Auth + RLS + Edge Functions). pnpm como gerenciador.

```bash
pnpm install          # instalar
pnpm start            # rodar o app (Expo)
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
```

## Arquitetura (siga à risca)

Fluxo de dependências: **UI → hooks → services → Supabase**. Nunca pule camadas.

- `app/` — apenas rotas/telas finas; a lógica mora em `src/features/*` e `src/hooks/*`.
- `src/features/<feature>/` — código de uma feature (onboarding, garden, vila, chat, help).
- `src/services/` — única camada que fala com Supabase ou com a IA.
- `src/store/` — estado global e **regras da economia** (moedas/multiplicador).
- Imports absolutos via alias `@/*` (ver `tsconfig.json`).

Não introduza DDD, Nest, nem camadas de abstração extras — o escopo é pequeno e
o tempo é curto. Prefira código direto e legível a padrões cerimoniais.

## Regras invioláveis

1. **Nada que imite a psicologia da aposta.** Proibido: recompensa aleatória,
   roleta, "gire e ganhe", caixa surpresa, barra que enche sozinha, qualquer
   mecânica de sorte. O progresso é sempre **previsível e merecido** (exigência
   do edital — ver `docs/EDITAL.md`).
2. **A chave da LLM nunca vai para o app.** Toda chamada de IA passa pela Edge
   Function `supabase/functions/chat`. O cliente só conhece a URL pública.
3. **Sem dados reais de clientes/BB.** Só dados públicos, sintéticos ou do próprio
   usuário. Nada de marcas de casas de aposta, clubes ou atletas.
4. **Linguagem acolhedora, nunca estigmatizante.** Recaída pausa o progresso,
   **nunca apaga** o que foi conquistado.
5. **Sempre deixar claro** que o app é apoio complementar e indicar canais de
   ajuda (CVV 188, CAPS, Jogadores Anônimos) nos momentos de crise.
6. **Declarar uso de IA** em qualquer entrega (exigência do edital).

## Convenções

- Componentes em PascalCase; hooks `useAlgo`; arquivos de feature em camelCase.
- Commits no padrão Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`.
- Uma branch por feature; abra PR para `main`.
- Textos de interface em **português brasileiro** natural.
