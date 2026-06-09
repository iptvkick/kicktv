import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNavBar } from "@/components/ui/BottomNavBar";

export const Route = createFileRoute("/cliente")({
  component: ClienteLayout,
});

function ClienteLayout() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      <main className="w-full max-w-md min-h-screen bg-background relative border-x border-border pb-24 flex flex-col">
        <Outlet />
        <BottomNavBar role="client" />
      </main>
    </div>
  );
}
