"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const ROUTES = [
  // Client Routes (Ordem da BottomNavBar)
  "/cliente/dashboard",
  "/cliente/player",
  "/cliente/suporte",
  "/cliente/perfil",
  // Admin Routes (Ordem da AdminSidebar)
  "/admin/dashboard",
  "/admin/planos",
  "/admin/servidores",
  "/admin/onboarding",
];

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const prevIdx = ROUTES.indexOf(prevPathRef.current);
    const currIdx = ROUTES.indexOf(pathname);

    if (prevIdx !== -1 && currIdx !== -1) {
      if (currIdx > prevIdx) {
        setDirection(1); // Vai para a direita (tela nova vem da direita pra esquerda)
      } else if (currIdx < prevIdx) {
        setDirection(-1); // Vai para a esquerda (tela nova vem da esquerda pra direita)
      }
    } else {
      setDirection(0); // Fade in default (se não estiver nas navbars)
    }

    prevPathRef.current = pathname;
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");

  const variants: Variants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: isAdmin ? 0 : (dir === 1 ? 50 : dir === -1 ? -50 : 0),
      y: isAdmin ? 0 : (dir === 0 ? 10 : 0),
    }),
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: isAdmin 
        ? { duration: 0.15, ease: "easeOut" } 
        : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: isAdmin ? 0 : (dir === 1 ? -50 : dir === -1 ? 50 : 0),
      y: isAdmin ? 0 : (dir === 0 ? -10 : 0),
      transition: isAdmin 
        ? { duration: 0.15, ease: "easeIn" }
        : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 flex flex-col w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
