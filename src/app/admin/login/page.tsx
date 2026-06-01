'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isLoading, error, login, checkAuth, clearError } = useAuthStore();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  // Giriş yapılıysa dashboard'a yönlendir
  useEffect(() => {
    if (mounted && user) router.push('/admin/dashboard');
  }, [user, mounted, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email || !password) return;
    const ok = await login(email, password);
    if (ok) router.push('/admin/dashboard');
  };

  if (!mounted || (isLoading && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md">
        {/* Kart */}
        <div className="card-luxury p-0 overflow-hidden">
          {/* Üst Başlık */}
          <div className="bg-charcoal-800 px-10 py-10 text-center space-y-2">
            <h1 className="font-display text-4xl text-gold">BIJOU</h1>
            <p className="font-sans font-300 text-xs uppercase tracking-widest text-warm-gray-400">
              Yönetim Paneli
            </p>
          </div>

          {/* Form */}
          <div className="px-10 py-10 space-y-6">
            {/* Hata Mesajı */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-sans">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="label-bijou">E-Posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="input-bijou"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Şifre */}
              <div>
                <label className="label-bijou">Şifre</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-bijou pr-10"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-400 hover:text-charcoal-600"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Giriş Butonu */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Giriş Yapılıyor…</>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </form>
          </div>

          {/* Alt Bilgi */}
          <div className="px-10 pb-8 text-center">
            <p className="text-2xs text-warm-gray-400 font-sans">
              🔒 Sadece yetkili yöneticiler giriş yapabilir
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
