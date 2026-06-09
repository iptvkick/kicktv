import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User as UserIcon, Shield, CreditCard } from "lucide-react";

export const Route = createFileRoute("/cliente/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setEmail(data.user.email);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <main className="flex-1 flex flex-col pt-12 pb-24 px-6">
      <header className="pb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-white/50" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-white">Meu Perfil</h1>
          <p className="text-sm text-[#00FF66] font-mono">{email || "Carregando..."}</p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <div className="bg-zinc-900/50 rounded-[20px] border border-white/5 overflow-hidden">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors text-left">
            <UserIcon className="w-5 h-5 text-white/70" />
            <span className="font-medium text-white/90">Dados Pessoais</span>
          </button>
          <div className="h-[1px] w-full bg-white/5" />
          <button className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors text-left">
            <CreditCard className="w-5 h-5 text-white/70" />
            <span className="font-medium text-white/90">Métodos de Pagamento</span>
          </button>
          <div className="h-[1px] w-full bg-white/5" />
          <button className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors text-left">
            <Shield className="w-5 h-5 text-white/70" />
            <span className="font-medium text-white/90">Segurança</span>
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 p-4 rounded-[20px] bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-colors border border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>
    </main>
  );
}
