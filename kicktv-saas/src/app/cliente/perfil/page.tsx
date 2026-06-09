"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, User as UserIcon, Shield, CreditCard } from "lucide-react";

export default function PerfilPage() {
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
    <main className="flex-1 flex flex-col pt-12 pb-24 px-6 bg-slate-50 min-h-screen">
      <header className="pb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center shadow-sm">
          <UserIcon className="w-8 h-8 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Meu Perfil</h1>
          {email ? (
            <p className="text-sm text-zinc-500">{email}</p>
          ) : (
            <div className="h-4 w-32 bg-zinc-200 animate-pulse rounded mt-1" />
          )}
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden shadow-sm">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors text-left">
            <UserIcon className="w-5 h-5 text-zinc-500" />
            <span className="font-semibold text-zinc-900">Dados Pessoais</span>
          </button>
          <div className="h-[1px] w-full bg-zinc-100" />
          <button className="w-full flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors text-left">
            <CreditCard className="w-5 h-5 text-zinc-500" />
            <span className="font-semibold text-zinc-900">Métodos de Pagamento</span>
          </button>
          <div className="h-[1px] w-full bg-zinc-100" />
          <button className="w-full flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors text-left">
            <Shield className="w-5 h-5 text-zinc-500" />
            <span className="font-semibold text-zinc-900">Segurança</span>
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 p-5 rounded-[32px] bg-white text-red-600 font-bold hover:bg-zinc-50 transition-colors border border-zinc-200 shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>
    </main>
  );
}
