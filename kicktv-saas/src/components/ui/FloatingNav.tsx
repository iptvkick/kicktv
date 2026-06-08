"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlaySquare, HeadphonesIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/cliente/dashboard", icon: Home, label: "Início" },
    { href: "/cliente/player", icon: PlaySquare, label: "Player" },
    { href: "/cliente/suporte", icon: HeadphonesIcon, label: "Suporte" },
    { href: "/cliente/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 bg-accent rounded-full flex items-center justify-around px-2 shadow-2xl z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300",
              isActive ? "bg-white/10" : "hover:bg-white/5"
            )}
            title={item.label}
          >
            <Icon 
              strokeWidth={isActive ? 2.5 : 2} 
              className={cn(
                "w-6 h-6 transition-all duration-300",
                isActive ? "text-white scale-110" : "text-white/60 scale-100"
              )} 
            />
          </Link>
        );
      })}
    </div>
  );
}
