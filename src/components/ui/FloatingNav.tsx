import { Link, useLocation } from "@tanstack/react-router";
import { Home, PlaySquare, HeadphonesIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingNav() {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/cliente/dashboard", icon: Home, label: "Início" },
    { to: "/cliente/player", icon: PlaySquare, label: "Player" },
    { to: "/cliente/suporte", icon: HeadphonesIcon, label: "Suporte" },
    { to: "/cliente/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 bg-white/90 border border-zinc-200 backdrop-blur-xl rounded-full flex items-center justify-around px-2 shadow-lg z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.to;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300",
              isActive ? "bg-zinc-100" : "hover:bg-zinc-50"
            )}
            title={item.label}
          >
            <Icon 
              strokeWidth={isActive ? 2.5 : 2} 
              className={cn(
                "w-6 h-6 transition-all duration-300",
                isActive ? "text-zinc-900 scale-110" : "text-zinc-500 scale-100"
              )} 
            />
          </Link>
        );
      })}
    </div>
  );
}
