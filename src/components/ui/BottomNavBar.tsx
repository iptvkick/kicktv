import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useLocation } from "@tanstack/react-router";
import {
  Home,
  MonitorPlay,
  Headset,
  User,
  LayoutDashboard,
  ListTree,
  Server,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const clientNavItems = [
  { label: "Início", icon: Home, href: "/cliente/dashboard" },
  { label: "Planos", icon: CreditCard, href: "/cliente/assinatura" },
  { label: "Suporte", icon: Headset, href: "/cliente/suporte" },
  { label: "Perfil", icon: User, href: "/cliente/perfil" },
];

const adminNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Planos", icon: ListTree, href: "/admin" },
  { label: "Servidores", icon: Server, href: "/admin" },
  { label: "Tutoriais", icon: Smartphone, href: "/admin" },
];

const MOBILE_LABEL_WIDTH = 72;

type BottomNavBarProps = {
  className?: string;
  role?: "admin" | "client";
  stickyBottom?: boolean;
};

export function BottomNavBar({
  className,
  role = "client",
  stickyBottom = true,
}: BottomNavBarProps) {
  const router = useRouter();
  const location = useLocation();
  const pathname = location.pathname;
  
  // Auto-detect role based on URL if not explicitly provided
  const activeRole = pathname.startsWith("/admin") ? "admin" : role;
  const navItems = activeRole === "admin" ? adminNavItems : clientNavItems;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const currentIndex = navItems.findIndex(item => pathname.startsWith(item.href));
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, navItems]);

  const handleNavigate = (idx: number, href: string) => {
    setActiveIndex(idx);
    router.navigate({ to: href });
  };

  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        "bg-white/90 border border-zinc-200 backdrop-blur-xl rounded-full flex items-center p-2 shadow-lg space-x-1 min-w-[320px] max-w-[95vw] h-[60px]",
        stickyBottom && "fixed inset-x-0 bottom-6 mx-auto z-50 w-fit",
        className,
      )}
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;

        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex items-center gap-0 px-4 py-2 rounded-full transition-colors duration-200 relative h-12 min-w-[48px] max-h-[48px]",
              isActive
                ? "bg-zinc-100 text-zinc-900 gap-2 shadow-sm"
                : "bg-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
              "focus:outline-none focus-visible:ring-0",
            )}
            onClick={() => handleNavigate(idx, item.href)}
            aria-label={item.label}
            type="button"
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 2}
              aria-hidden
              className="transition-all duration-200"
            />

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "8px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className={cn("overflow-hidden flex items-center max-w-[80px]")}
            >
              <span
                className={cn(
                  "font-bold text-sm whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis leading-[1.9]",
                  isActive ? "text-zinc-900" : "opacity-0",
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

