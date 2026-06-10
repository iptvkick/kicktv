import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, CheckCircle2, Copy, Check, ArrowLeft, Loader2, Minus, Plus, PlayCircle, RefreshCcw } from "lucide-react";
import { CheckoutSimulator } from "@/components/sandbox/CheckoutSimulator";

export const Route = createFileRoute("/cliente/assinatura")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: AssinaturaPage,
});

function AssinaturaPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [extraUsers, setExtraUsers] = useState(0);
  
  const [cpf, setCpf] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Timer & Realtime states
  const [pixTimer, setPixTimer] = useState(600);
  const [pixPaid, setPixPaid] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);
      if (profileData?.cpf) setCpf(profileData.cpf);

      const { data: subData } = await supabase.from("subscriptions").select("*, plans(*)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      setSubscription(subData);

      if (subData?.id) {
        const { data: invData } = await supabase.from("invoices").select("*").eq("subscription_id", subData.id).order("created_at", { ascending: false });
        setInvoices(invData || []);
        if (invData && invData.length > 0) {
          setCurrentInvoiceId(invData[0].id);
        }
      }

      const { data: plansData } = await supabase.from("plans").select("*").eq("is_active", true);
      setPlans(plansData || []);
      
      if (plansData && plansData.length > 0) {
        setSelectedPlanId(subData?.plan_id || plansData[0].id);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  // Supabase Realtime Listener para Invoices
  useEffect(() => {
    if (!profile?.id) return;
    
    const channel = supabase.channel('public:invoices')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'invoices',
      }, (payload) => {
        const newRecord = payload.new as any;
        if (newRecord && newRecord.status === 'RECEIVED') {
          setPixPaid(true);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    }
  }, [profile?.id]);

  // Pix Countdown Timer
  useEffect(() => {
    let interval: any;
    if (checkoutResult && !pixPaid && pixTimer > 0) {
      interval = setInterval(() => {
        setPixTimer(prev => prev - 1);
      }, 1000);
    } else if (pixTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [checkoutResult, pixPaid, pixTimer]);

  const handleCheckout = async () => {
    setCheckoutError(null);
    if (!cpf) {
      setCheckoutError("Por favor, informe seu CPF.");
      return;
    }
    setIsGenerating(true);
    
    // Auto save CPF
    if (profile && profile.cpf !== cpf) {
      await supabase.from("profiles").update({ cpf }).eq("id", profile.id);
    }

    const { data, error } = await supabase.functions.invoke('asaas-checkout', {
      body: {
        planId: selectedPlanId,
        serverId: subscription?.server_id || 'default',
        cpfCnpj: cpf,
        extraUsers: extraUsers
      }
    });

    setIsGenerating(false);

    if (error || data?.error) {
      setCheckoutError(error?.message || data?.error || 'Erro ao gerar pagamento');
    } else {
      setCheckoutResult(data);
      setPixTimer(600);
      setPixPaid(false);
      
      // Update invoices to grab the new one for the Simulator
      if (subscription?.id) {
        const { data: invData } = await supabase.from("invoices").select("*").eq("subscription_id", subscription.id).order("created_at", { ascending: false });
        if (invData && invData.length > 0) {
          setCurrentInvoiceId(invData[0].id);
        }
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col pt-12 px-6 w-full gap-8 animate-pulse bg-background min-h-screen">
        <div className="h-8 w-40 bg-border rounded-md"></div>
        <div className="h-48 w-full bg-border rounded-[24px]"></div>
        <div className="h-64 w-full bg-border rounded-[24px]"></div>
      </div>
    );
  }

  const isExpired = subscription?.expires_at ? new Date(subscription.expires_at).getTime() < new Date().getTime() : true;
  const isActive = subscription?.status === 'active' || (subscription?.status === 'trialing' && !isExpired);
  const status = subscription?.status || 'none';
  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const totalPrice = (selectedPlan?.base_price || 0) + (extraUsers * (selectedPlan?.extra_user_price || 0));

  return (
    <main className="flex-1 flex flex-col pt-12 pb-24 px-6">
      <CheckoutSimulator invoiceId={currentInvoiceId || undefined} />


      <header className="pb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-[24px] bg-card border border-border shadow-sm flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-foreground/50" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sua Assinatura</h1>
          <p className="text-sm text-foreground/60 font-medium">Gerencie seu plano e pagamentos</p>
        </div>
      </header>

      {/* SEÇÃO 1: STATUS ATUAL */}
      <div className="bg-card rounded-[32px] p-8 border border-border shadow-sm mb-8 flex flex-col relative overflow-hidden">
        {status === 'active' && <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />}
        {status === 'trialing' && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />}
        {(status === 'OVERDUE' || status === 'canceled') && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />}
        
        <div className="flex items-center gap-3 mb-6">
          {status === 'active' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">ATIVO</span>}
          {status === 'trialing' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">TRIAL ATIVO</span>}
          {(status === 'OVERDUE' || status === 'canceled') && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">VENCIDO / INATIVO</span>}
          {status === 'none' && <span className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-xs font-bold border border-zinc-200">SEM ASSINATURA</span>}
        </div>

        <h2 className="text-4xl font-black text-foreground mb-2">{subscription?.plans?.name || 'Nenhum plano ativo'}</h2>
        
        {subscription?.expires_at && (
          <p className="text-sm font-medium text-foreground/60 mb-6">
            {isExpired ? 'Expirou em' : 'Vence em'} {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm font-semibold text-foreground/80">
          <div className="flex flex-col">
            <span className="text-foreground/40 text-[10px] uppercase tracking-wider">Telas Ativas</span>
            <span className="text-xl font-bold">{subscription?.plans?.max_connections || 0}</span>
          </div>
          <div className="w-[1px] h-8 bg-border"></div>
          <div className="flex flex-col">
            <span className="text-foreground/40 text-[10px] uppercase tracking-wider">Telas Extras</span>
            <span className="text-xl font-bold">+{subscription?.extra_users_count || 0}</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: ESCOLHER / RENOVAR PLANO */}
      {(!isActive || status === 'trialing') && !pixPaid && (
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4 text-foreground">Escolha seu Plano</h3>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-5 rounded-[24px] border-2 text-left flex items-center justify-between transition-all ${selectedPlanId === plan.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'}`}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground text-lg">{plan.name}</span>
                  <span className="text-sm text-foreground/60">{plan.max_connections} Tela{plan.max_connections > 1 ? 's' : ''} inclusa{plan.max_connections > 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black text-foreground">R$ {plan.base_price}</span>
                  <span className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">/ mês</span>
                </div>
              </button>
            ))}
          </div>

          {selectedPlan && (
            <div className="bg-card border border-border p-5 rounded-[24px] flex flex-col gap-4 mb-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">Adicionar Telas Extras</span>
                  <span className="text-xs text-foreground/60">+ R$ {selectedPlan.extra_user_price || 0} por tela</span>
                </div>
                <div className="flex items-center gap-4 bg-background border border-border rounded-full p-1">
                  <button onClick={() => setExtraUsers(Math.max(0, extraUsers - 1))} className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-border hover:bg-border transition-colors"><Minus className="w-4 h-4 text-foreground" /></button>
                  <span className="font-bold text-foreground w-4 text-center">{extraUsers}</span>
                  <button onClick={() => setExtraUsers(extraUsers + 1)} className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-border hover:bg-border transition-colors"><Plus className="w-4 h-4 text-foreground" /></button>
                </div>
              </div>
            </div>
          )}

          {checkoutResult ? (
            <div className="bg-card border-2 border-primary/20 p-6 rounded-[32px] flex flex-col items-center text-center shadow-lg animate-in zoom-in-95 relative overflow-hidden">
              <div className="absolute top-4 right-6 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" /> {formatTimer(pixTimer)}
              </div>
              
              {pixTimer > 0 ? (
                <>
                  <div className="w-48 h-48 bg-white p-2 rounded-[24px] mb-4 mt-8 flex items-center justify-center shadow-inner border border-border">
                    {checkoutResult.pix?.encodedImage ? (
                      <img src={`data:image/png;base64,${checkoutResult.pix.encodedImage}`} alt="QR Code PIX" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-zinc-400 text-xs font-medium">Sem QR Code</div>
                    )}
                  </div>
                  <h4 className="font-bold text-foreground text-xl mb-1">R$ {totalPrice.toFixed(2)}</h4>
                  <p className="text-sm font-medium text-foreground/60 mb-6">Escaneie o QR Code ou copie o código PIX.</p>
                  
                  {checkoutResult.pix?.payload && (
                    <button 
                      onClick={() => copyToClipboard(checkoutResult.pix.payload)}
                      className="w-full bg-background border border-border flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 transition-colors group cursor-pointer mb-4"
                    >
                      <span className="text-xs font-mono text-foreground/60 truncate mr-4">{checkoutResult.pix.payload}</span>
                      {copied ? <Check className="w-5 h-5 text-green-500 shrink-0" /> : <Copy className="w-5 h-5 text-foreground shrink-0 group-hover:scale-110 transition-transform" />}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full py-12">
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <h4 className="font-bold text-foreground text-xl mb-2">Tempo Esgotado</h4>
                  <p className="text-sm font-medium text-foreground/60 mb-8">O código PIX expirou. Gere um novo pagamento.</p>
                  
                  <button 
                    onClick={() => {
                      setCheckoutResult(null);
                      setPixTimer(600);
                    }}
                    className="bg-primary text-primary-foreground py-4 px-8 rounded-[20px] font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCcw className="w-5 h-5" /> Gerar Novo PIX
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {checkoutError && (
                <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl text-sm font-semibold flex items-center justify-between">
                  <span>{checkoutError}</span>
                  <button onClick={() => setCheckoutError(null)} className="opacity-70 hover:opacity-100">×</button>
                </div>
              )}
              <input 
                type="text" 
                placeholder="Seu CPF/CNPJ para a nota" 
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                className="w-full bg-background border border-border px-4 py-4 rounded-[20px] font-medium text-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button 
                onClick={handleCheckout}
                disabled={isGenerating || !selectedPlan}
                className="w-full bg-primary text-primary-foreground py-4 rounded-[20px] font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CreditCard className="w-5 h-5 fill-current" /> Assinar por R$ {totalPrice.toFixed(2)}</>}
              </button>
            </div>
          )}
        </div>
      )}

      {/* TELA DE SUCESSO (PIX PAGO) */}
      <AnimatePresence>
        {pixPaid && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border-2 border-emerald-500/20 p-10 rounded-[32px] flex flex-col items-center text-center shadow-lg mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center shadow-xl mb-6 shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-2">Pagamento Confirmado!</h2>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold mb-8">Sua assinatura foi ativada com sucesso.</p>
            
            <button 
              onClick={() => navigate({ to: '/cliente/player' })}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-[20px] font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <PlayCircle className="w-6 h-6" /> Ir para a TV
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEÇÃO 3: HISTÓRICO DE FATURAS */}
      <h3 className="text-xl font-bold mb-4 text-foreground">Histórico de Faturas</h3>
      <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm flex flex-col mb-12">
        {invoices.length > 0 ? (
          invoices.map((inv, index) => (
            <div key={inv.id} className={`flex items-center justify-between p-4 ${index !== invoices.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground text-sm">{new Date(inv.created_at).toLocaleDateString('pt-BR')}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/40">{inv.description || 'Fatura KickTV'}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-foreground">R$ {inv.value ?? inv.amount}</span>
                {inv.status === 'RECEIVED' || inv.status === 'CONFIRMED' ? (
                  <span className="text-[10px] font-bold uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-md">PAGO</span>
                ) : inv.status === 'PENDING' ? (
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">PENDENTE</span>
                ) : (
                  <span className="text-[10px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-md">{inv.status}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-foreground/50 text-sm font-medium">Nenhuma fatura encontrada.</div>
        )}
      </div>

    </main>
  );
}
