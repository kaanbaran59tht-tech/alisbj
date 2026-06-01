'use client';

import { create } from 'zustand';
// 1. DÜZELTME: createClient fonksiyonu yerine doğrudan hazır supabase objesini çağırıyoruz
import { supabase } from '@/lib/supabase';

interface AuthStore {
    user: any | null;
    isLoading: boolean;
    error: string | null;

    checkAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            // 2. DÜZELTME: "const supabase = createClient();" satırları kaldırıldı, yukarıdaki global obje kullanılıyor
            const { data: { user } } = await supabase.auth.getUser();
            set({ user, isLoading: false, error: null });
        } catch {
            set({ user: null, isLoading: false });
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            // 3. DÜZELTME: Hazır olan supabase nesnesi doğrudan tetikleniyor
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                const msg =
                    error.message === 'Invalid login credentials'
                        ? 'E-posta veya şifre hatalı.'
                        : error.message;
                set({ user: null, isLoading: false, error: msg });
                return false;
            }
            set({ user: data.user, isLoading: false, error: null });
            return true;
        } catch (err: any) {
            set({ user: null, isLoading: false, error: err?.message || 'Giriş başarısız.' });
            return false;
        }
    },

    logout: async () => {
        // 4. DÜZELTME: Çıkış işleminde de direkt hazır nesne kullanılıyor
        await supabase.auth.signOut();
        set({ user: null });
    },

    clearError: () => set({ error: null }),
}));