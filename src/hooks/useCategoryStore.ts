import { create } from 'zustand';
import { CATEGORIES as INITIAL_CATEGORIES } from '@/types/index';
import { supabase } from '@/lib/supabase';

export interface UICategory {
    id: string;
    name: string;
    slug?: string;
    icon?: any;
    virtual?: boolean;
    display_order?: number;
    is_active?: boolean;
}

interface CategoryStore {
    activeCategory: string | null;
    categories: UICategory[];
    isLoading: boolean;
    setActiveCategory: (categoryId: string | null) => void;
    loadCategories: () => Promise<void>;
    addCategory: (category: { name: string; icon?: string }) => Promise<{ success: boolean; error?: string }>;
    deleteCategory: (categoryId: string) => Promise<{ success: boolean; error?: string }>;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    activeCategory: null,
    categories: [...INITIAL_CATEGORIES],
    isLoading: false,

    setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),

    loadCategories: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) {
                console.error('Kategoriler DB den çekilemedi:', error.message);
                set({ isLoading: false });
                return;
            }

            if (data && data.length > 0) {
                // Initial static categories map for retaining React Lucide icons
                const initialMap = new Map<string, UICategory>();
                INITIAL_CATEGORIES.forEach((c) => {
                    initialMap.set(c.id, c as UICategory);
                    initialMap.set(c.name.toUpperCase(), c as UICategory);
                });

                const virtualNew = INITIAL_CATEGORIES.find((c) => (c as any).virtual);

                const dbCategories: UICategory[] = data.map((item) => {
                    const matched = initialMap.get(item.id) || initialMap.get(item.name.toUpperCase());
                    return {
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        icon: item.icon || matched?.icon || '🏷️',
                        display_order: item.display_order,
                        is_active: item.is_active,
                    };
                });

                const merged = virtualNew ? [virtualNew as UICategory, ...dbCategories] : dbCategories;
                set({ categories: merged, isLoading: false });
            } else {
                set({ categories: [...INITIAL_CATEGORIES], isLoading: false });
            }
        } catch (err) {
            console.error('Kategoriler yüklenirken hata:', err);
            set({ isLoading: false });
        }
    },

    addCategory: async ({ name, icon }) => {
        const cleanName = name.trim().toUpperCase();
        if (!cleanName) return { success: false, error: 'Kategori adı zorunludur' };

        const currentCats = get().categories;
        if (currentCats.some(c => c.name.toUpperCase() === cleanName)) {
            return { success: false, error: 'Bu isimde bir kategori zaten mevcut' };
        }

        const slug = slugify(cleanName) || `cat-${Date.now()}`;
        const newOrder = currentCats.length + 1;
        const iconValue = icon?.trim() || '🏷️';

        try {
            const { data, error } = await supabase
                .from('categories')
                .insert([
                    {
                        name: cleanName,
                        slug,
                        icon: iconValue,
                        display_order: newOrder,
                        is_active: true,
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            const newCategory: UICategory = {
                id: data.id,
                name: data.name,
                slug: data.slug,
                icon: data.icon || iconValue,
                display_order: data.display_order,
                is_active: data.is_active,
            };

            set({ categories: [...get().categories, newCategory] });
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Kategori eklenirken hata oluştu' };
        }
    },

    deleteCategory: async (categoryId: string) => {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', categoryId);

            if (error) throw error;

            set({
                categories: get().categories.filter(c => c.id !== categoryId),
                activeCategory: get().activeCategory === categoryId ? null : get().activeCategory,
            });
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Kategori silinemedi' };
        }
    },
}));
