import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { BottomNavBar } from "@/components/ui/BottomNavBar";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/cliente")({
  component: ClienteLayout,
});

const ROUTES = [
  '/cliente/dashboard',
  '/cliente/player',
  '/cliente/suporte',
  '/cliente/perfil'
];

function ClienteLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentIndex = ROUTES.indexOf(location.pathname);

  const handleDragEnd = (e: any, { offset }: any) => {
    const swipe = offset.x;
    const threshold = 50;
    
    if (swipe < -threshold && currentIndex < ROUTES.length - 1 && currentIndex !== -1) {
      // Swipe left (arraste para a esquerda -> avança rota)
      navigate({ to: ROUTES[currentIndex + 1] });
    } else if (swipe > threshold && currentIndex > 0 && currentIndex !== -1) {
      // Swipe right (arraste para a direita -> volta rota)
      navigate({ to: ROUTES[currentIndex - 1] });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      <main className="w-full max-w-md min-h-screen bg-background relative border-x border-border pb-24 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col w-full"
            style={{ touchAction: "pan-y" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <BottomNavBar role="client" />
      </main>
    </div>
  );
}
