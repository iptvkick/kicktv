import { createFileRoute, redirect } from "@tanstack/react-router";
import { Bell, Settings2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cliente/dashboard")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

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
          .select("*, plans(*)")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        setSubscription(subData);
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
      <div className="flex flex-col pt-12 px-6 w-full gap-8 animate-pulse bg-[#f8f9fa] min-h-screen">
        <div className="flex justify-between items-center pb-6">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-8 w-40 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
        </div>
        
        <div className="w-full aspect-[4/5] bg-gray-200 rounded-[24px]"></div>
        
        <div className="flex flex-col gap-4 mt-4">
          <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
          <div className="h-24 w-full bg-gray-200 rounded-[20px]"></div>
        </div>
      </div>
    );
  }

  const daysRemaining = subscription && subscription.expires_at
    ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
    : 0;

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';

  return (
    <div className="flex flex-col pt-12 px-6 bg-[#f8f9fa] min-h-screen">
      <header className="pb-6 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm text-[#212529]/60 font-medium uppercase tracking-wider">Bem-vindo de volta</span>
          <h1 className="text-2xl font-bold tracking-tight text-[#212529]">Olá, {profile?.email?.split('@')[0] || 'Cliente'}</h1>
        </div>
        <button className="h-12 w-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#212529] hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Hero Card SDD Clean */}
      <div className="relative w-full aspect-[4/5] bg-white rounded-[32px] overflow-hidden shadow-xl p-6 flex flex-col justify-end text-[#212529] border border-gray-200">
        
        <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 shadow-sm">
          <Settings2 className="w-5 h-5 text-[#212529]" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-[#212529]/80">
              {isActive ? 'Plano Ativo' : 'Expirado'}
            </span>
          </div>
          
          <h2 className="text-4xl font-extrabold mb-1 tracking-tight">
            {subscription?.plans?.name || 'Premium'}
          </h2>
          <p className="text-sm text-[#212529]/60 font-medium">
            {isActive && subscription?.expires_at ? `Vence em ${daysRemaining} dias (${new Date(subscription.expires_at).toLocaleDateString('pt-BR')})` : 'Sem plano ativo.'}
          </p>
          
          {isActive ? (
            <div className="mt-6 flex flex-col gap-3">
              <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-[#212529]/50 font-bold tracking-wider">Usuário M3U</span>
                  <span className="font-mono text-sm font-semibold">{profile?.email?.split('@')[0]}</span>
                </div>
                <button className="text-xs bg-white border border-gray-200 hover:bg-gray-100 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">Copiar</button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-[#212529]/50 font-bold tracking-wider">Senha M3U</span>
                  <span className="font-mono text-sm font-semibold">••••••••</span>
                </div>
                <button className="text-xs bg-white border border-gray-200 hover:bg-gray-100 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">Copiar</button>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-semibold">Sua assinatura expirou. Renove agora para continuar assistindo.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <h3 className="text-lg font-bold text-[#212529]">Faturas Asaas</h3>
        <div className="bg-white p-5 rounded-[20px] shadow-sm flex items-center justify-between border border-gray-100">
          <div className="flex flex-col">
            <span className="font-bold text-[#212529]">Renovação Mensal</span>
            <span className="text-sm text-gray-500">R$ {subscription?.plans?.base_price || '35.00'} / mês</span>
          </div>
          <button className="bg-[#212529] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-[#343a40] transition-colors flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Pagar PIX
          </button>
        </div>
      </div>
    </div>
  );
}
