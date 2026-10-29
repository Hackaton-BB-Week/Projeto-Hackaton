import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Leitores de tela: os ícones são caracteres de uma fonte especial e, sem isso, o
// TalkBack/VoiceOver (e o leitor na web) leem um símbolo sem sentido. Todo ícone do
// app é decorativo (os botões só com ícone têm accessibilityLabel), então escondemos
// todos de uma vez. Importado uma vez em app/_layout.tsx.
// Se algum dia um ícone precisar ser lido, passe accessible e importantForAccessibility nele.
const HIDDEN = {
  accessible: false,
  accessibilityElementsHidden: true, // iOS
  importantForAccessibility: 'no-hide-descendants', // Android
  'aria-hidden': true, // web
};

for (const Icon of [Feather, Ionicons, MaterialCommunityIcons]) {
  // O objeto de padrões é compartilhado com a classe interna do ícone: basta completá-lo.
  Object.assign((Icon as unknown as { defaultProps: object }).defaultProps, HIDDEN);
}
