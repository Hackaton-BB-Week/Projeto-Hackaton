import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Platform, findNodeHandle, type Text } from 'react-native';

/**
 * Leva o foco do leitor de tela para `ref` (normalmente o título de um painel)
 * quando `active` vira true. Painéis desenhados dentro da tela (sem <Modal>) não
 * recebem o foco sozinhos: sem isso, quem usa leitor de tela continua "atrás" do painel.
 * Na web, também tira o foco do teclado do botão que ficou escondido atrás.
 */
export function useA11yFocus(active = true) {
  const ref = useRef<Text>(null);

  useEffect(() => {
    if (!active) return;
    // Espera o painel montar e a animação de entrada começar.
    const t = setTimeout(() => {
      const node = ref.current as unknown;
      if (!node) return;
      if (Platform.OS === 'web') {
        const el = node as HTMLElement;
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus?.({ preventScroll: true });
      } else {
        const handle = findNodeHandle(node as Text);
        if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [active]);

  return ref;
}
