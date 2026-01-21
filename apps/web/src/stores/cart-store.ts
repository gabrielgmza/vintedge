import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  wineId: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  image: string;
  customization?: {
    labelDesign?: string;
    labelText?: string;
    bottleType?: string;
    corkType?: string;
    capsuleColor?: string;
    packaging?: string;
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Computed
  totalItems: () => number;
  totalPrice: () => number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCustomization: (id: string, customization: CartItem['customization']) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => 
              item.wineId === newItem.wineId && 
              JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
          );

          if (existingItemIndex > -1) {
            // Item exists, increase quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += 1;
            return { items: updatedItems, isOpen: true };
          }

          // New item
          return {
            items: [...state.items, { ...newItem, quantity: 1 }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      updateCustomization: (id, customization) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, customization: { ...item.customization, ...customization } } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: 'cart-storage',
      version: 1,
    }
  )
);
