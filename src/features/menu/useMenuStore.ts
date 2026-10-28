import { create } from 'zustand';

// Abre/fecha o menu lateral de qualquer tela. O <SideMenu /> fica em app/_layout.tsx.
interface MenuState {
  open: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  open: false,
  openMenu: () => set({ open: true }),
  closeMenu: () => set({ open: false }),
}));
