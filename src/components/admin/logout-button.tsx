"use client";

import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-stone-800 hover:bg-red-950 hover:text-red-300 text-stone-300 text-xs font-semibold transition border border-stone-700"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Keluar (Logout)</span>
    </button>
  );
}
