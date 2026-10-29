# Rolê que Rende

App mobile do hackathon **BBDW 2026** (Banco do Brasil) para apoiar pessoas a
repensarem sua relação com as apostas. A ideia central: transformar o dinheiro e
o tempo que deixam de ir para as apostas em **progresso real e gamificado**.

> Apoio complementar — **não** substitui acompanhamento profissional de saúde.

## Visão geral do produto

1. **Boas-vindas / login** (local, sem autenticação real no MVP)
2. **Pesquisa diagnóstica** (5–7 perguntas, gera um "ponto de partida")
3. **Vila que Rende** — o jogo principal: moedas conquistadas reformam uma vila
4. **Jardim de progresso** — visualização dos dias sem apostar
5. **Chat (Rô)** — tira dúvidas sobre apostas e sobre o app
6. **Ajuda / SOS** — canais oficiais (CVV 188, CAPS, Jogadores Anônimos)

Economia do jogo: **cada R$ 1 preservado = 1 moeda**; a **sequência de dias**
multiplica o ganho diário (×1 → ×1,2 → ×1,5 → ×2 → ×3). Ver `docs/GAMIFICACAO.md`.

## Stack

| Camada | Escolha |
|---|---|
| App | React Native + **Expo** + **TypeScript** + Expo Router |
| Estado | **Zustand** (UI) + **TanStack Query** (dados do Supabase) |
| Backend | **Supabase** (Postgres + Auth + RLS + Edge Functions) |
| IA (chat) | **Supabase Edge Function** (proxy — a chave da LLM nunca vai pro app) |
| Gerenciador | **npm** |

> Decisões assumidas: **npm** e **Edge Function** para a IA. Para hospedar a IA na Vercel em vez do
> Supabase, mova `supabase/functions/chat` para uma rota serverless e ajuste a
> URL em `.env`.

## Como rodar

```bash
npm install
cp .env.example .env    # preencha com suas chaves do Supabase
npx expo install        # alinha as versões nativas ao SDK do Expo
npm start               # abre o Expo; leia o QR com o Expo Go
```

## Estrutura

```
app/              # rotas (Expo Router): telas e navegação
src/
  features/       # onboarding, garden, vila, chat, help
  components/     # UI reutilizável
  hooks/          # lógica compartilhada (UI -> hooks -> services)
  services/       # supabase client, chamada à IA
  store/          # estado global (zustand) + regras da economia
  lib/            # helpers (formatação de moeda, etc.)
  theme/          # tokens de cor e tipografia
supabase/         # schema SQL + RLS + Edge Function do chat
docs/             # MVP, arquitetura, edital, gamificação
```

## Fluxo de branches

Usamos gitflow: `dev` é a branch padrão e de integração; `main` só recebe
versões estáveis vindas de `dev`.

```bash
git switch dev && git pull
git switch -c feat/vila            # nova feature a partir de dev
git switch -c sub/vila-mapa        # sub-branch a partir de feat/vila
```

PRs: `sub/*` → `feat/*` → `dev` → `main`, sempre com merge commit.
Detalhes em `AGENTS.md` (seção "Fluxo de branches").

## Documentos

- `docs/MVP.md` — escopo e fluxo das telas
- `docs/ARQUITETURA.md` — padrões e regras de organização
- `docs/GAMIFICACAO.md` — mecânica da Vila e da economia de moedas
- `docs/EDITAL.md` — regras do edital e restrições que o produto DEVE respeitar
- `docs/prototipo/role-que-rende.html` — protótipo interativo (referência de UX); abra no navegador
- `AGENTS.md` — instruções para trabalhar com assistentes de IA neste repo
