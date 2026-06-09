"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function PromotePage() {
  const router = useRouter();
  const [status, setStatus] = useState("Verificando sessão...");

  useEffect(() => {
    async function promote() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("Não logado. Vá para o login.");
        return;
      }

      setStatus(`Promovendo ${user.email} para admin...`);
      
      const { error } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id);

      if (error) {
        setStatus("Erro ao promover: " + error.message);
      } else {
        setStatus("Sucesso! Redirecionando para o painel de admin...");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      }
    }

    promote();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f6f7]">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#212529]" />
      <h1 className="text-xl font-bold text-[#212529]">{status}</h1>
    </div>
  );
}
