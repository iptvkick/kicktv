import { Link, useLocation } from "@tanstack/react-router";
import { Tv, LogOut, Smartphone, Server, ListTree, LayoutDashboard, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const adminNavItems = [
  { label: "Visão Geral", icon: LayoutDashboard, href: "/admin" },
  { label: "Planos", icon: Wallet, href: "/admin/planos" },
  { label: "Servidores", icon: Server, href: "/admin/servidores" },
  { label: "Tutoriais", icon: Smartphone, href: "/admin/onboarding" },
  { label: "Categorias", icon: ListTree, href: "/admin/tutoriais" },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="w-[280px] min-h-screen bg-white border-r border-gray-200 flex-col hidden md:flex sticky top-0">
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
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
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
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
