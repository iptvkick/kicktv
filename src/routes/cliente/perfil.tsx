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
    <main className="flex-1 flex flex-col pt-12 pb-24 px-6 bg-[#f8f9fa] min-h-screen">
      <header className="pb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-[#212529]/50" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-[#212529]">Meu Perfil</h1>
          <p className="text-sm text-[#212529]/60 font-medium">{email || "Carregando..."}</p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left">
            <UserIcon className="w-5 h-5 text-[#212529]/70" />
            <span className="font-semibold text-[#212529]">Dados Pessoais</span>
          </button>
          <div className="h-[1px] w-full bg-gray-100" />
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left">
            <CreditCard className="w-5 h-5 text-[#212529]/70" />
            <span className="font-semibold text-[#212529]">Métodos de Pagamento</span>
          </button>
          <div className="h-[1px] w-full bg-gray-100" />
          <button className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left">
            <Shield className="w-5 h-5 text-[#212529]/70" />
            <span className="font-semibold text-[#212529]">Segurança</span>
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 p-5 rounded-[24px] bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>
    </main>
  );
}
