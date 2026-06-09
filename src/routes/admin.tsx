import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth/login" });
    else if (role !== "admin") navigate({ to: "/cliente/dashboard" });
  }, [loading, user, role, navigate]);

  if (loading || !user || role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7]">
        <Loader2 className="w-8 h-8 animate-spin text-[#212529]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6f7] font-sans text-[#212529]">
      <AdminSidebar />
      <main className="flex-1 min-h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
