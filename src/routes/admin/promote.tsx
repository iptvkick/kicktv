import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/promote")({
  component: PromotePage,
});

function PromotePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verificando sessão...");

  useEffect(() => {
    async function promote() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("Você não está logado. Faça login primeiro em /auth/login.");
        return;
      }
      setStatus(`Promovendo ${user.email} para admin...`);

      // Insert admin role (ignores if already exists)
      const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
      if (error && !error.message.includes("duplicate")) {
        setStatus("Erro ao promover: " + error.message);
        return;
      }
      // Also keep profiles.role in sync for any legacy code
      await supabase.from("profiles").update({ role: "admin" }).eq("id", user.id);

      setStatus("Sucesso! Redirecionando para o painel...");
      setTimeout(() => navigate({ to: "/admin" }), 1500);
    }
    promote();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f6f7]">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#212529]" />
      <h1 className="text-xl font-bold text-[#212529] text-center px-6">{status}</h1>
    </div>
  );
}
