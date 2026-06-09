"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ListTree, 
  Server, 
  Smartphone,
  LogOut,
  Tv
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const adminNavItems = [
  { label: "Visão Geral", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Planos", icon: ListTree, href: "/admin/planos" },
  { label: "Servidores", icon: Server, href: "/admin/servidores" },
  { label: "Tutoriais", icon: Smartphone, href: "/admin/onboarding" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-[280px] h-screen bg-white border-r border-gray-200 flex flex-col hidden md:flex sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-[#212529] flex items-center justify-center">
          <Tv className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl text-[#212529] tracking-tight">KickTV Admin</span>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Principal</span>
        
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? "bg-[#f5f6f7] text-[#212529] font-bold shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#212529]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#212529]" : "text-gray-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
