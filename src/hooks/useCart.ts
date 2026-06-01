import { create } from 'zustand';
import { CartItem } from '@/types/index';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  addPackage: (item: Omit<CartItem, 'id'>) => void;
  updatePackageQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  getTotal: () => number;
  getTotalPackages: () => number;
  getTotalUnits: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addPackage: (newItem: Omit<CartItem, 'id'>) =>
    set((state) => {
      const id = `${newItem.productId}-${newItem.selectedVariant?.id || 'default'}`;

      const existing = state.items.find((i) => i.id === id);

      if (existing) {
        // Seçilen paket sayısını mevcut üstüne ekle
        return {
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          ),
          isOpen: true,
        };
      }

      return {
        items: [{ ...newItem, id }, ...state.items],
        isOpen: true,
      };
    }),

  // itemId artık CartItem.id — varyantsız aynı ürün + farklı varyant ayrı satır
  updatePackageQuantity: (itemId: string, quantity: number) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.id !== itemId)
          : state.items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i
            ),
    })),

  removeItem: (itemId: string) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    })),

  clearCart: () => set({ items: [], isOpen: false }),
  openCart:  () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getTotal: () =>
    get().items.reduce((sum, i) => sum + i.packagePrice * i.quantity, 0),

  getTotalPackages: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),

  getTotalUnits: () =>
    get().items.reduce((sum, i) => sum + i.quantity * 6, 0),
}));
