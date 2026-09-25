import { createClient as supabaseCreateClient } from '@supabase/supabase-js';

// 1. Supabase Bağlantı Bilgileri
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gtawaijiinjkwjpzrdvn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_D7S48MJLxTkdwqdJK2al_Q_1HOJ6wvN";

export const supabase = supabaseCreateClient(supabaseUrl, supabaseAnonKey);
export function createClient() {
    return supabase;
}