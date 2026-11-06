"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, PhoneCall } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

type HeaderProps = {
  storeName: string;
  waNumber: string;
};

export function Header({ storeName, waNumber }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, isLoaded } = useCart();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/produk", label: "Katalog Produk" },
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/kontak", label: "Kontak & Lokasi" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-amber-700 transition">
            {storeName.replace(/\[ISI\]/g, "").trim().charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg text-stone-900 leading-tight group-hover:text-amber-700 transition">
              {storeName}
            </span>
            <span className="text-xs text-stone-500 font-medium">UMKM Kuliner & Pilihan</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-amber-50 text-amber-800 font-semibold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick WA Contact link on desktop */}
          <a
            href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(storeName)}%2C%20saya%20ingin%20bertanya%20produk`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chat Admin</span>
          </a>

          {/* Cart Button */}
          <Link
            href="/keranjang"
            className="relative p-2.5 rounded-full text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="w-6 h-6" />
            {isLoaded && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in-75">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-1 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-amber-50 text-amber-800 font-semibold"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-stone-100">
            <a
              href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(storeName)}%2C%20saya%20ingin%20bertanya%20produk`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
