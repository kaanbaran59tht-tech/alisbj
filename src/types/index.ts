// ═════════════════════════════════════════════════════════════════════════
// BIJOU — Tür Tanımları (12'li Paket Sistemi)
// ═════════════════════════════════════════════════════════════════════════

// ─── Ürün Varyantları (Renk, Ölçü vb.) ──────────────────────────────────
export interface ProductVariant {
    id: string;
    name: string; // "Altın", "Gümüş", "38 Beden", vb.
    color?: string;
    size?: string;
}

import { createElement } from 'react';
import {
    Link2, Heart, Sparkles, Circle, Waves,
    Sun, Gem, Watch, Crown, Smile, Moon, User
} from 'lucide-react';

const iconClass = "w-4 h-4 inline-block";

// ─── Kategoriler (DÜZELTME: id alanları Supabase UUID'leri ile eşitlendi) ──
export const CATEGORIES = [
    { id: 'virtual-new-arrivals', name: 'YENİ EKLENENLER', icon: createElement(Sparkles, { className: iconClass }), virtual: true },
    { id: 'aa111111-1111-1111-1111-111111111111', name: 'BİLEKLİK', icon: createElement(Link2, { className: iconClass }) },
    { id: 'bb222222-2222-2222-2222-222222222222', name: 'KOLYE', icon: createElement(Heart, { className: iconClass }) },
    { id: 'cc333333-3333-3333-3333-333333333333', name: 'KÜPE', icon: createElement(Sparkles, { className: iconClass }) },
    { id: 'dd444444-4444-4444-4444-444444444444', name: 'YÜZÜK', icon: createElement(Circle, { className: iconClass }) },
    { id: 'ee555555-5555-5555-5555-555555555555', name: 'HALHAL', icon: createElement(Waves, { className: iconClass }) },
    { id: 'ff666666-6666-6666-6666-666666666666', name: 'CHARM', icon: createElement(Sun, { className: iconClass }) },
    { id: '77777777-7777-7777-7777-777777777777', name: 'HIZMA & PIERCING', icon: createElement(Gem, { className: iconClass }) },
    { id: '88888888-8888-8888-8888-888888888888', name: 'TOKA', icon: createElement(Moon, { className: iconClass }) },
    { id: '99999999-9999-9999-9999-999999999999', name: 'XUPİNG', icon: createElement(Crown, { className: iconClass }) },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'ÇOCUKLARA ÖZEL', icon: createElement(Smile, { className: iconClass }) },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'ÇELİK KOLYE UCU', icon: createElement(Moon, { className: iconClass }) },
    { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'ERKEK ÜRÜNLERİ', icon: createElement(User, { className: iconClass }) },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ─── Ürün (12 Adet = 1 Paket) ──────────────────────────────────────────
export interface Product {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    image_url?: string | null;
    created_at: string;
    updated_at?: string;
    created_by?: string | null;
    is_active?: boolean;
    category_id?: string | null;

    // UI/Frontend özel (DB'de olmayan)
    slug?: string;
    variants?: ProductVariant[];
    category_name?: string;
}

// ─── Sepet Ürünü (Paket Sistemi) ──────────────────────────────────────
export interface CartItem {
    id: string; // productId-variantId
    productId: string;
    title: string;
    packagePrice: number; // 12 adet fiyatı
    quantity: number; // PAKET SAYISI (1 paket = 12 adet)
    selectedVariant?: {
        id: string;
        name: string;
    };
    image_url?: string;
    category_id?: string;
}

// ─── Koleksiyon ────────────────────────────────────────────────────────
export interface Collection {
    id: string;
    slug: string;
    name: string;
    description: string;
    coverImage: string;
    products?: Product[];
    productCount?: number;
}

// ─── Sipariş ────────────────────────────────────────────────────────────
export type OrderStatus =
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

export interface OrderItem {
    id?: string;
    order_id?: string;
    title: string;
    image_url?: string | null;
    category_id?: string | null;
    package_price: number;
    quantity: number;
    variant?: string | null;
}

export interface Order {
    id?: string;
    short_id?: string;
    customer_name: string;
    customer_phone: string;
    customer_address?: string | null;
    total: number;
    created_at: string;

    // UI/Frontend özel alanlar
    items?: OrderItem[];
    status?: OrderStatus;
    whatsappMessageId?: string;
    notes?: string;
}

// ─── Admin ──────────────────────────────────────────────────────────────
export interface AdminUser {
    id: string;
    email: string;
    createdAt: string;
}

// ─── Filtreler ──────────────────────────────────────────────────────────
export interface ProductFilters {
    category?: string[];
    search?: string;
    page?: number;
    pageSize?: number;
}

// ─── API Yanıtları ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}