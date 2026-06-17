import { create } from 'zustand';

interface CategoryStore {
    activeCategory: string | null;
    setActiveCategory: (categoryId: string | null) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    activeCategory: null,
    setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),
}));
