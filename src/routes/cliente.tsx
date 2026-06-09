import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNavBar } from "@/components/ui/BottomNavBar";

export const Route = createFileRoute("/cliente")({
  component: ClienteLayout,
});

function ClienteLayout() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f8f9fa]">
      <main className="w-full max-w-md min-h-screen bg-[#f8f9fa] relative border-x border-gray-200 pb-24 flex flex-col">
        <Outlet />
        <BottomNavBar role="client" />
      </main>
    </div>
  );
}
