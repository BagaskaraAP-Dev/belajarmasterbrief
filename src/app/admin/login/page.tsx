"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message || "Email atau password yang Anda masukkan salah."
        );
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrorMessage("Terjadi gangguan koneksi. Silakan coba sesaat lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Login Administrator
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Masuk untuk mengelola produk, pesanan, dan pengaturan toko.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Email Administrator
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@umkm.local"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {isLoading ? (
              <span>Memeriksa Akses...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-stone-100">
          <Link
            href="/"
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition"
          >
            ← Kembali ke Situs Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
