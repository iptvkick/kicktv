import { createFileRoute, redirect } from "@tanstack/react-router";
import { Bell, Settings2 } from "lucide-react";
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
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [extraScreens, setExtraScreens] = useState(0);

  useEffect(() => {
    async function fetchPlans() {
      const { data } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('base_price', { ascending: true });
      
      if (data && data.length > 0) {
        setPlans(data);
        setSelectedPlanId(data[0].id);
      }
    }
    fetchPlans();
  }, []);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const totalValue = selectedPlan ? Number(selectedPlan.base_price) + (Number(selectedPlan.extra_screen_price) * extraScreens) : 0;

  return (
    <main className="flex-1 flex flex-col">
      {/* Topbar */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center bg-background">
        <div className="flex flex-col">
          <span className="text-sm text-foreground/60 font-medium">Bem-vindo de volta</span>
          <h1 className="text-2xl font-bold tracking-tight">Olá, Cliente</h1>
        </div>
        <button className="h-12 w-12 rounded-full bg-card shadow-sm flex items-center justify-center text-foreground hover:bg-black/5 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Content */}
      <div className="px-6 flex flex-col gap-8">
        
        {/* Assinatura Card (Hero) */}
        <div className="relative w-full aspect-[4/5] bg-card rounded-[24px] overflow-hidden shadow-sm p-6 flex flex-col justify-end text-white">
          <div className="absolute inset-0 bg-gradient-to-bl from-zinc-800 to-black" />
          
          <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Plano Ativo</span>
            </div>
            <h2 className="text-4xl font-bold mb-1">KickTV Premium</h2>
            <p className="text-sm text-white/70">Vence em 15 dias (23/06/2026)</p>
            
            <div className="mt-6 flex flex-col gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-white/50 font-bold tracking-wider">Usuário</span>
                  <span className="font-mono text-sm">joao123</span>
                </div>
                <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors">Copiar</button>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-white/50 font-bold tracking-wider">Senha</span>
                  <span className="font-mono text-sm">••••••••</span>
                </div>
                <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition-colors">Copiar</button>
              </div>
            </div>
          </div>
        </div>

        {/* Renovação Secção Dinâmica */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Renovar ou Fazer Upgrade</h3>
          
          {plans.length > 0 && selectedPlan ? (
            <div className="bg-white p-5 rounded-[24px] shadow-sm flex flex-col gap-4 border border-zinc-100">
              <div className="flex flex-col gap-3">
                {plans.map(plan => (
                  <label key={plan.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${selectedPlanId === plan.id ? 'border-accent bg-accent/5' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="plan" checked={selectedPlanId === plan.id} onChange={() => setSelectedPlanId(plan.id)} className="w-5 h-5 accent-accent" />
                      <span className="font-bold">{plan.name}</span>
                    </div>
                    <span className="font-bold text-accent">R$ {Number(plan.base_price).toFixed(2)}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-100">
                <div className="flex flex-col">
                  <span className="font-bold">Telas Extras (+R$ {Number(selectedPlan.extra_screen_price).toFixed(2)}/cada)</span>
                  <span className="text-xs text-zinc-500">Adicione pontos para sua casa</span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setExtraScreens(Math.max(0, extraScreens - 1))} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-lg">-</button>
                  <span className="font-bold text-lg">{extraScreens}</span>
                  <button onClick={() => setExtraScreens(Math.min(3, extraScreens + 1))} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-lg">+</button>
                </div>
              </div>

              <button className="w-full bg-accent text-white py-4 rounded-xl font-bold mt-2 shadow-md hover:bg-zinc-800 transition-colors flex justify-center items-center gap-2">
                Pagar R$ {totalValue.toFixed(2)} via Asaas
              </button>
            </div>
          ) : (
            <div className="bg-card p-5 rounded-[20px] shadow-sm flex items-center justify-center">
               <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
