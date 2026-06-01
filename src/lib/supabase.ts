import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

// 1. Supabase Bağlantı Bilgileri
const supabaseUrl = "https://qzcbuukvnxgsaozzzcwb.supabase.co";
const supabaseAnonKey = "sb_publishable_WWbD1oYMoL4YlaQ08KgZkw_K4fsnkDB";

// 2. WhatsApp Sipariş Numarası (Örn: 905XXXXXXXXX)
// Eğer sistem bir yerde process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER ararsa diye buraya yedekliyoruz
if (typeof window !== 'undefined') {
    (window as any).NEXT_PUBLIC_ADMIN_PHONE_NUMBER = "905452544951";
}

if (!supabaseUrl || supabaseUrl.includes("your-project-id")) {
    console.error("DİKKAT: src/lib/supabase.ts dosyasındaki bilgileri değiştirmeyi unutmayın!");
}

export const supabase = supabaseCreateClient(supabaseUrl, supabaseAnonKey);
export function createClient() {
    return supabase;
}