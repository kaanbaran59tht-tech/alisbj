import { create } from 'zustand';
import { CartItem } from '@/types/index';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Aksiyonlar
  addPackage: (item: Omit<CartItem, 'id'>) => void;
  updatePackageQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Hesaplayıcılar
  getTotal: () => number; // Toplam TL
  getTotalPackages: () => number; // Toplam paket sayısı
  getTotalUnits: () => number; // Toplam adet (paket x 6)
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  /**
   * 1 paket ekle (arka planda 6 adet)
   * Aynı ürün + aynı varyant varsa, paket sayısını artır
   */
  addPackage: (newItem: Omit<CartItem, 'id'>) =>
    set((state) => {
      // Aynı ürün ve varyant kontrolü
      const existing = state.items.find(
        (i) =>
          i.productId === newItem.productId &&
          i.selectedVariant?.id === newItem.selectedVariant?.id
      );

      if (existing) {
        // Var olan üründe paket sayısını artır
        return {
          items: state.items.map((i) =>
            i.productId === newItem.productId &&
            i.selectedVariant?.id === newItem.selectedVariant?.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      // Yeni ürün ekle
      const id = `${newItem.productId}-${newItem.selectedVariant?.id || 'default'}`;
      return {
        items: [{ ...newItem, id }, ...state.items],
        isOpen: true,
      };
    }),

  /**
   * Ürünün paket sayısını güncelle
   * 0 veya negatif = sil
   */
  updatePackageQuantity: (productId: string, quantity: number) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            ),
    })),

  /**
   * Ürünü sepetten sil
   */
  removeItem: (productId: string) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  /**
   * Sepeti tamamen boşalt
   */
  clearCart: () => set({ items: [], isOpen: false }),

  /**
   * Sepeti aç
   */
  openCart: () => set({ isOpen: true }),

  /**
   * Sepeti kapat
   */
  closeCart: () => set({ isOpen: false }),

  /**
   * Toplam TL hesapla
   */
  getTotal: () => {
    const items = get().items;
    return items.reduce(
      (sum, item) => sum + item.packagePrice * item.quantity,
      0
    );
  },

  /**
   * Toplam paket sayısı
   */
  getTotalPackages: () => {
    const items = get().items;
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Toplam adet (paket x 6)
   */
  getTotalUnits: () => {
    const items = get().items;
    return items.reduce((sum, item) => sum + item.quantity * 6, 0);
  },
}));
