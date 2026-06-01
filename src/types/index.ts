// ═════════════════════════════════════════════════════════════════════════
// BIJOU — Tür Tanımları (6'lı Paket Sistemi)
// ═════════════════════════════════════════════════════════════════════════

// ─── Ürün Varyantları (Renk, Ölçü vb.) ──────────────────────────────────
export interface ProductVariant {
    id: string;
    name: string; // "Altın", "Gümüş", "38 Beden", vb.
    color?: string;
    size?: string;
}

// ─── Kategoriler (DÜZELTME: id alanları Supabase UUID'leri ile eşitlendi) ──
export const CATEGORIES = [
    { id: 'aa111111-1111-1111-1111-111111111111', name: 'BİLEKLİK', icon: '⌚' },
    { id: 'bb222222-2222-2222-2222-222222222222', name: 'KOLYE', icon: '📿' },
    { id: 'cc333333-3333-3333-3333-333333333333', name: 'KÜPE', icon: '💎' },
    { id: 'dd444444-4444-4444-4444-444444444444', name: 'YÜZÜK', icon: '💍' },
    { id: 'ee555555-5555-5555-5555-555555555555', name: 'HALHAL', icon: '📍' },
    { id: 'ff666666-6666-6666-6666-666666666666', name: 'CHARM', icon: '✨' },
    { id: '77777777-7777-7777-7777-777777777777', name: 'HIZMA & PIERCING', icon: '🔧' },
    { id: '88888888-8888-8888-8888-888888888888', name: 'SAAT', icon: '⏰' },
    { id: '99999999-9999-9999-9999-999999999999', name: 'XUPİNG', icon: '👑' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'ÇOCUKLARA ÖZEL', icon: '👧' },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'ÇELİK KOLYE UCU', icon: '🔗' },
    { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'ERKEK ÜRÜNLERİ', icon: '👨' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export interface Category {
    id: CategoryId;
    name: string;
}

// ─── Ürün (6 Adet = 1 Paket) ───────────────────────────────────────────
export interface Product {
    id: string;
    slug: string;
    name: string;
    description?: string;
    price: number; // PAKET FİYATI (6 adet içindir)
    image_url?: string;
    variants?: ProductVariant[]; // Renk, ölçü vb.
    category_id: CategoryId; // DÜZELTME: category -> category_id yapıldı (UUID uyumlu)
    category_name?: string; // Kategori adı
    is_active?: boolean;
    created_at: string;
    updated_at?: string;
}

// ─── Sepet Ürünü (Paket Sistemi) ──────────────────────────────────────
export interface CartItem {
    id: string; // productId-variantId
    productId: string;
    title: string;
    packagePrice: number; // 6 adet fiyatı
    quantity: number; // PAKET SAYISI (1 paket = 6 adet)
    selectedVariant?: {
        id: string;
        name: string;
    };
    image_url?: string;
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
    productId: string;
    productName: string;
    packagePrice: number;
    packageQuantity: number; // Kaç paket
    unitQuantity: number; // Kaç adet (packageQuantity * 6)
    selectedVariant?: {
        id: string;
        name: string;
    };
    totalPrice: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    status: OrderStatus;
    totalPrice: number;
    whatsappMessageId?: string;
    notes?: string;
    createdAt: string;
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