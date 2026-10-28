# Feature: vila

Jogo principal: a cidade isométrica que a pessoa reconstrói com as moedas que
conquista. Custos e requisitos são fixos (nada de sorte). Regras da economia em
`src/store/useGameStore.ts`; obras concluídas em `src/store/useVilaStore.ts`.

## Como usar

A tela só importa o bloco pronto:

```tsx
import { VilaSection } from '@/features/vila';

<VilaSection />;
```

## Arquivos

| Arquivo                                 | Papel                                                        |
| --------------------------------------- | ------------------------------------------------------------ |
| `VilaSection.tsx`                       | bloco da Home: cidade, lista de obras, painel e avisos       |
| `data/cities.ts`                        | cidades, lotes, custos, requisitos e estilos (do protótipo)  |
| `scene/painter.tsx`                     | primitivas isométricas em SVG (bloco, telhado, sombra, piso) |
| `scene/buildings.ts`, `scene/ground.ts` | desenho dos prédios, ruínas, enfeites e chão                 |
| `scene/CityScene.tsx`                   | cidade inteira + miniatura de prédio (`BuildingPreview`)     |
| `scene/CityView.tsx`                    | câmera: arrastar, pinça, +/− e toque nos prédios             |
| `components/`                           | cabeçalho com progresso, lista de obras e painel da obra     |

Em desenvolvimento aparece um botão "+300 moedas" para testar sem precisar
registrar dias. Ele some no build de produção (`__DEV__`).
