import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FloatingNav } from "@/components/ui/FloatingNav";

export const Route = createFileRoute("/cliente")({
  component: ClienteLayout,
});

function ClienteLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <Outlet />
      <FloatingNav />
    </div>
  );
}
