# Feature: planta diária

Planta de progresso e registro diário, seguindo o protótipo (`plantMiniSVG`,
`registrarDia`, `registrarRecaida`, `openRetomada`).

- **Cresce** com o total de dias sem apostar registrados (6 estágios, `plant.ts`).
- **Um registro por dia do calendário.** A sequência só continua em dias seguidos.
- **Recaída:** sequência e multiplicador voltam a ×1, a planta murcha. Moedas, obras
  e tamanho da planta ficam.
- **Um dia inteiro sem cuidado** (sem registro nem missão) também murcha a planta.
- **Missão de retomada:** gesto simples de autocuidado, escolhido pelo calendário
  (sem sorteio). Recupera a planta e dá +10 moedas; não conta como dia.

Uso na Home (tudo autossuficiente):
- `<PlantBadge />` — bolinha da planta no canto do mapa.
- `<RecoveryBanner />` e `<DailyActions />` — abaixo do mapa.
- `<PlantSheets />` — painéis; montar uma vez na tela.

Estado em `src/store/usePlantStore.ts` (salvo no aparelho). Em desenvolvimento há o
botão "Simular +1 dia".
