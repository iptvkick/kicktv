"use client";

import { useEffect, useState } from "react";
import { Bell, Settings2, Loader2, RefreshCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/integrations/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type Plan = Database["public"]["Tables"]["plans"]["Row"];
type Server = Database["public"]["Tables"]["servers"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<(Subscription & { plans: Plan | null, servers: Server | null }) | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        const { data: subData } = await supabase
          .from("subscriptions")
          .select("*, plans(*), servers(*)")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        setSubscription(subData as any);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#00FF66]" />
      </div>
    );
  }

  const daysRemaining = subscription 
    ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
    : 0;

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';

  return (
    <main className="flex-1 flex flex-col pt-12 pb-24">
      {/* Topbar */}
      <header className="px-6 pb-6 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Bem-vindo de volta</span>
          <h1 className="text-2xl font-bold tracking-tight text-white">Olá, {profile?.email?.split('@')[0] || 'Cliente'}</h1>
        </div>
        <button className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Content */}
      <div className="px-6 flex flex-col gap-8">
        
        {/* Assinatura Card (Hero) */}
        <div className="relative w-full aspect-[4/5] bg-zinc-900 rounded-[24px] overflow-hidden shadow-2xl p-6 flex flex-col justify-end text-white border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00FF66]/20 to-black/80 mix-blend-overlay" />
          
          <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Settings2 className="w-5 h-5 text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#00FF66] animate-pulse shadow-[0_0_10px_#00FF66]' : 'bg-red-500'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                {isActive ? 'Plano Ativo' : 'Expirado'}
              </span>
            </div>
            
            <h2 className="text-4xl font-black mb-1 tracking-tight">
              {subscription?.plans?.name || 'KickTV Trial'}
            </h2>
            <p className="text-sm text-white/70">
              Vence em {daysRemaining} dias ({new Date(subscription?.expires_at || '').toLocaleDateString('pt-BR')})
            </p>
            
            {isActive ? (
              <div className="mt-6 flex flex-col gap-3">
                <div className="bg-black/40 backdrop-blur-xl rounded-xl p-3 flex justify-between items-center border border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-[#00FF66] font-bold tracking-wider">Usuário M3U</span>
                    <span className="font-mono text-sm">{profile?.email?.split('@')[0]}</span>
                  </div>
                  <button className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors">Copiar</button>
                </div>
                <div className="bg-black/40 backdrop-blur-xl rounded-xl p-3 flex justify-between items-center border border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-[#00FF66] font-bold tracking-wider">Senha M3U</span>
                    <span className="font-mono text-sm">••••••••</span>
                  </div>
                  <button className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors">Copiar</button>
                </div>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-200">Sua assinatura expirou. Renove agora para continuar assistindo.</p>
              </div>
            )}
          </div>
        </div>

        {/* Renovação Secção */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Faturas Asaas</h3>
          <div className="bg-zinc-900/50 backdrop-blur-md p-5 rounded-[20px] shadow-sm flex items-center justify-between border border-white/5">
            <div className="flex flex-col">
              <span className="font-bold text-white">Renovação Mensal</span>
              <span className="text-sm text-muted-foreground">R$ {subscription?.plans?.price_monthly || '35,00'} / mês</span>
            </div>
            <button className="bg-[#00FF66] text-black px-6 py-3 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:scale-105 transition-all flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Pagar via PIX
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
