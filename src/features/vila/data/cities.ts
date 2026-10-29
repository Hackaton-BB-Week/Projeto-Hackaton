// Cidades da Vila que Rende. Dados copiados do protótipo (docs/prototipo/role-que-rende.html).
// Cada obra tem custo fixo em moedas e um requisito fixo (nº de obras já concluídas):
// o progresso é sempre previsível, nunca sorteado.

export type BuildingType =
  | 'house'
  | 'apartment'
  | 'civic'
  | 'shop'
  | 'market'
  | 'sport'
  | 'plaza'
  | 'park'
  | 'garden'
  | 'trees'
  | 'beach'
  | 'kiosk'
  | 'pier'
  | 'palm';

export type AmbientType = 'tree' | 'bigtree' | 'lamp' | 'bench' | 'palm';

export interface Plot {
  id: string;
  gx: number;
  gy: number;
  type: BuildingType;
  zone: string;
  name: string;
  cost: number;
  unlock: number;
  benefit: string;
  hasStyle?: boolean;
}

export interface Ambient {
  gx: number;
  gy: number;
  type: AmbientType;
  sc?: number;
}

export interface City {
  key: 'bairro' | 'orla';
  name: string;
  nx: number;
  ny: number;
  ox: number;
  oy: number;
  grassA: string;
  grassB: string;
  soilL: string;
  soilR: string;
  bounds: { minx: number; miny: number; maxx: number; maxy: number };
  plots: Plot[];
  ambient: Ambient[];
}

export interface StyleOption {
  name: string;
  color: string;
}

export function styleOptionsFor(type: BuildingType): StyleOption[] {
  if (type === 'house')
    return [
      { name: 'Telhado vermelho', color: '#c0442b' },
      { name: 'Telhado verde', color: '#248049' },
      { name: 'Telhado azul', color: '#2f5fb0' },
    ];
  if (type === 'shop')
    return [
      { name: 'Fachada âmbar', color: '#f3cd84' },
      { name: 'Fachada verde', color: '#bcd9b0' },
    ];
  if (type === 'beach')
    return [
      { name: 'Teto turquesa', color: '#2f93a8' },
      { name: 'Teto coral', color: '#d97e2e' },
    ];
  return [{ name: 'Padrão', color: '#9aa1ad' }];
}

export const CITIES: City[] = [
  {
    key: 'bairro',
    name: 'Bairro Esperança',
    nx: 7,
    ny: 7,
    ox: 280,
    oy: 78,
    grassA: '#7ec84e',
    grassB: '#73bf43',
    soilL: '#8a6b3e',
    soilR: '#6e5531',
    bounds: { minx: 54, miny: 22, maxx: 500, maxy: 300 },
    plots: [
      {
        id: 'r1',
        gx: 0,
        gy: 0,
        type: 'house',
        zone: 'Residencial',
        name: 'Restaurar uma casa',
        cost: 40,
        unlock: 0,
        hasStyle: true,
        benefit: 'Uma casa colorida volta a ter vida.',
      },
      {
        id: 'r2',
        gx: 1,
        gy: 0,
        type: 'house',
        zone: 'Residencial',
        name: 'Recuperar a casa vizinha',
        cost: 55,
        unlock: 1,
        hasStyle: true,
        benefit: 'Mais uma família volta pra rua.',
      },
      {
        id: 'r3',
        gx: 1,
        gy: 1,
        type: 'house',
        zone: 'Residencial',
        name: 'Reformar a casa da esquina',
        cost: 70,
        unlock: 1,
        hasStyle: true,
        benefit: 'A rua residencial ganha forma.',
      },
      {
        id: 'r4',
        gx: 0,
        gy: 1,
        type: 'apartment',
        zone: 'Residencial',
        name: 'Erguer o prédio de moradia',
        cost: 130,
        unlock: 2,
        benefit: 'Um prédio dá altura ao bairro.',
      },
      {
        id: 'r5',
        gx: 2,
        gy: 0,
        type: 'house',
        zone: 'Residencial',
        name: 'Restaurar a casa do fim da rua',
        cost: 60,
        unlock: 2,
        hasStyle: true,
        benefit: 'A quadra residencial se completa.',
      },
      {
        id: 'g1',
        gx: 0,
        gy: 2,
        type: 'garden',
        zone: 'Área verde',
        name: 'Cultivar o canteiro da frente',
        cost: 55,
        unlock: 2,
        benefit: 'Flores e uma pequena horta.',
      },
      {
        id: 'c1',
        gx: 4,
        gy: 0,
        type: 'shop',
        zone: 'Comercial',
        name: 'Reabrir a lojinha',
        cost: 90,
        unlock: 3,
        hasStyle: true,
        benefit: 'O comércio local recomeça.',
      },
      {
        id: 'c2',
        gx: 5,
        gy: 0,
        type: 'civic',
        zone: 'Comunitária',
        name: 'Abrir o centro comunitário',
        cost: 140,
        unlock: 3,
        benefit: 'Espaço pra atividades em grupo.',
      },
      {
        id: 'c3',
        gx: 6,
        gy: 0,
        type: 'market',
        zone: 'Comercial',
        name: 'Montar o mercado de bairro',
        cost: 130,
        unlock: 4,
        benefit: 'Feira e mercado movimentam a rua.',
      },
      {
        id: 'c4',
        gx: 5,
        gy: 1,
        type: 'shop',
        zone: 'Comercial',
        name: 'Recuperar a fachada comercial',
        cost: 75,
        unlock: 4,
        hasStyle: true,
        benefit: 'A esquina comercial ganha cor.',
      },
      {
        id: 'c5',
        gx: 6,
        gy: 1,
        type: 'apartment',
        zone: 'Residencial',
        name: 'Erguer o edifício do centro',
        cost: 135,
        unlock: 5,
        benefit: 'Mais altura no coração da vila.',
      },
      {
        id: 'v1',
        gx: 0,
        gy: 4,
        type: 'trees',
        zone: 'Área verde',
        name: 'Plantar as primeiras árvores',
        cost: 55,
        unlock: 5,
        benefit: 'O verde começa a voltar.',
      },
      {
        id: 'v2',
        gx: 0,
        gy: 5,
        type: 'park',
        zone: 'Área verde',
        name: 'Recuperar o parque',
        cost: 100,
        unlock: 5,
        benefit: 'Um parque pra respirar.',
      },
      {
        id: 'v3',
        gx: 1,
        gy: 5,
        type: 'garden',
        zone: 'Área verde',
        name: 'Cultivar a horta comunitária',
        cost: 65,
        unlock: 6,
        benefit: 'Uma horta pra todo mundo.',
      },
      {
        id: 'v4',
        gx: 0,
        gy: 6,
        type: 'house',
        zone: 'Residencial',
        name: 'Reformar a casa do parque',
        cost: 70,
        unlock: 6,
        hasStyle: true,
        benefit: 'Moradia de frente pro verde.',
      },
      {
        id: 's1',
        gx: 5,
        gy: 5,
        type: 'sport',
        zone: 'Comunitária',
        name: 'Montar a quadra esportiva',
        cost: 95,
        unlock: 6,
        benefit: 'Esporte sem precisar apostar no jogo.',
      },
      {
        id: 's2',
        gx: 6,
        gy: 5,
        type: 'shop',
        zone: 'Comercial',
        name: 'Abrir o café da esquina',
        cost: 90,
        unlock: 7,
        hasStyle: true,
        benefit: 'Um café pra encontrar amigos.',
      },
      {
        id: 's3',
        gx: 6,
        gy: 6,
        type: 'house',
        zone: 'Residencial',
        name: 'Restaurar a última casa',
        cost: 80,
        unlock: 7,
        hasStyle: true,
        benefit: 'A vila está quase completa.',
      },
    ],
    ambient: [
      { gx: 3, gy: 3, type: 'bigtree' },
      { gx: 2, gy: 2, type: 'lamp' },
      { gx: 4, gy: 2, type: 'lamp' },
      { gx: 2, gy: 4, type: 'bench' },
      { gx: 4, gy: 4, type: 'bench' },
      { gx: 2, gy: 6, type: 'tree', sc: 0.9 },
      { gx: 6, gy: 2, type: 'tree', sc: 0.9 },
      { gx: 6, gy: 4, type: 'tree', sc: 0.8 },
      { gx: 4, gy: 6, type: 'tree', sc: 0.85 },
      { gx: 1, gy: 6, type: 'tree', sc: 0.7 },
      { gx: 3, gy: 2, type: 'lamp' },
    ],
  },
  {
    key: 'orla',
    name: 'Orla Nova',
    nx: 6,
    ny: 6,
    ox: 280,
    oy: 92,
    grassA: '#f0dca0',
    grassB: '#e8d08c',
    soilL: '#cdb173',
    soilR: '#b89a5c',
    bounds: { minx: 84, miny: 40, maxx: 474, maxy: 300 },
    plots: [
      {
        id: 'o1',
        gx: 0,
        gy: 0,
        type: 'beach',
        zone: 'Beira-mar',
        name: 'Restaurar a casa de praia',
        cost: 70,
        unlock: 0,
        hasStyle: true,
        benefit: 'Casinha litorânea reerguida.',
      },
      {
        id: 'o2',
        gx: 1,
        gy: 0,
        type: 'beach',
        zone: 'Beira-mar',
        name: 'Recuperar o chalé vizinho',
        cost: 85,
        unlock: 1,
        hasStyle: true,
        benefit: 'A orla ganha moradores.',
      },
      {
        id: 'o3',
        gx: 3,
        gy: 0,
        type: 'kiosk',
        zone: 'Orla',
        name: 'Abrir o quiosque',
        cost: 95,
        unlock: 1,
        benefit: 'Um ponto de encontro na areia.',
      },
      {
        id: 'o4',
        gx: 4,
        gy: 0,
        type: 'beach',
        zone: 'Beira-mar',
        name: 'Reerguer a casa da ponta',
        cost: 90,
        unlock: 2,
        hasStyle: true,
        benefit: 'Mais cor na beira-mar.',
      },
      {
        id: 'o5',
        gx: 5,
        gy: 0,
        type: 'beach',
        zone: 'Beira-mar',
        name: 'Restaurar o chalé do canto',
        cost: 100,
        unlock: 2,
        hasStyle: true,
        benefit: 'A orla se completa.',
      },
      {
        id: 'o6',
        gx: 0,
        gy: 1,
        type: 'apartment',
        zone: 'Orla',
        name: 'Erguer o prédio da orla',
        cost: 130,
        unlock: 3,
        benefit: 'Vista de mar pra todo mundo.',
      },
      {
        id: 'o7',
        gx: 4,
        gy: 1,
        type: 'shop',
        zone: 'Comercial',
        name: 'Abrir a sorveteria',
        cost: 90,
        unlock: 3,
        hasStyle: true,
        benefit: 'Um docinho na beira da praia.',
      },
      {
        id: 'o8',
        gx: 5,
        gy: 1,
        type: 'kiosk',
        zone: 'Orla',
        name: 'Montar o segundo quiosque',
        cost: 95,
        unlock: 4,
        benefit: 'Mais um ponto de encontro.',
      },
      {
        id: 'o9',
        gx: 0,
        gy: 3,
        type: 'palm',
        zone: 'Natureza',
        name: 'Plantar os coqueiros',
        cost: 60,
        unlock: 4,
        benefit: 'Sombra e brisa na orla.',
      },
      {
        id: 'o10',
        gx: 2,
        gy: 4,
        type: 'pier',
        zone: 'Orla',
        name: 'Construir o píer',
        cost: 120,
        unlock: 5,
        benefit: 'Um píer pra ver o mar.',
      },
    ],
    ambient: [
      { gx: 3, gy: 1, type: 'palm' },
      { gx: 1, gy: 3, type: 'palm' },
      { gx: 4, gy: 3, type: 'palm' },
      { gx: 5, gy: 3, type: 'bench' },
      { gx: 3, gy: 2, type: 'lamp' },
    ],
  },
];
