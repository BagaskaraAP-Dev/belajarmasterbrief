import { requireAdmin } from "@/lib/auth";
import { getStoreSettings } from "@/features/settings/queries";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  MessageSquare,
  Settings,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect all /admin routes
  let session = null;
  try {
    session = await requireAdmin();
  } catch {
    // If not authenticated, let proxy.ts redirect or render login wrapper
  }

  const settings = await getStoreSettings();

  const navItems = [
    { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/admin/produk", label: "Kelola Produk", icon: Package },
    { href: "/admin/kategori", label: "Kategori", icon: FolderTree },
    { href: "/admin/pesanan", label: "Pesanan Masuk", icon: ShoppingBag },
    { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquare },
    { href: "/admin/pengaturan", label: "Pengaturan Toko", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 flex flex-col shrink-0 border-r border-stone-800">
        {/* Brand */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block">
                Admin Panel
              </span>
              <span className="text-xs text-stone-400 truncate max-w-[140px] block">
                {settings.name}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-300 hover:text-white hover:bg-stone-800 transition"
              >
                <Icon className="w-4 h-4 text-amber-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info & Logout */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="truncate">{session?.user?.email || "admin"}</span>
            <Link
              href="/"
              target="_blank"
              className="hover:text-amber-400 flex items-center gap-1"
              title="Lihat Situs Publik"
            >
              <span>Lihat Web</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
