import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Bell, Settings2, X, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

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
  
  const [devices, setDevices] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [selectingDevice, setSelectingDevice] = useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        setSubscription(subData);

        if (subData) {
          if (!subData.dispositivo_principal) {
            const { data: devicesData } = await supabase.from('onboarding_devices').select('*').order('name');
            setDevices(devicesData || []);
          } else {
            const { data: stepsData } = await supabase.from('onboarding_steps').select('*').eq('device_id', subData.dispositivo_principal).order('step_order');
            setSteps(stepsData || []);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSelectDevice = async (deviceId: string) => {
    if (!subscription) return;
    setSelectingDevice(true);
    const { error } = await supabase
      .from('subscriptions')
      .update({ dispositivo_principal: deviceId })
      .eq('id', subscription.id);
    
    if (!error) {
      setSubscription({ ...subscription, dispositivo_principal: deviceId });
      const { data: stepsData } = await supabase.from('onboarding_steps').select('*').eq('device_id', deviceId).order('step_order');
      setSteps(stepsData || []);
    }
    setSelectingDevice(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col pt-12 px-6 w-full gap-8 animate-pulse bg-background min-h-screen">
        <div className="flex justify-between items-center pb-6">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-border rounded-md"></div>
            <div className="h-8 w-40 bg-border rounded-md"></div>
          </div>
          <div className="h-12 w-12 rounded-full bg-border"></div>
        </div>
        
        <div className="w-full aspect-[4/5] bg-border rounded-[24px]"></div>
        
        <div className="flex flex-col gap-4 mt-4">
          <div className="h-6 w-32 bg-border rounded-md"></div>
          <div className="h-24 w-full bg-border rounded-[24px]"></div>
        </div>
      </div>
    );
  }

  const isExpired = subscription && subscription.expires_at
    ? new Date(subscription.expires_at).getTime() < new Date().getTime()
    : true;

  const daysRemaining = subscription && subscription.expires_at && !isExpired
    ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
    : 0;
  
  const hoursRemaining = subscription && subscription.expires_at && !isExpired
    ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - new Date().getTime()) / (1000 * 3600)))
    : 0;

  const isActive = subscription?.status === 'active' || (subscription?.status === 'trialing' && !isExpired);

  return (
    <div className="flex flex-col pt-12 px-6 bg-background min-h-screen">
      <header className="pb-6 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm text-foreground/60 font-medium uppercase tracking-wider">Bem-vindo de volta</span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Olá, {profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || 'Cliente'}</h1>
        </div>
        <button 
          onClick={() => setIsNotificationsOpen(true)}
          className="h-12 w-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-border transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Subscription Status Banners */}
      {(() => {
        const status = subscription?.status
        const expiresAt = subscription?.expires_at
        const expireDate = expiresAt ? new Date(expiresAt).toLocaleDateString('pt-BR') : null

        if (status === 'trialing' || status === 'PENDING') {
          return (
            <Link
              to="/cliente/assinatura"
              className="flex items-center justify-between gap-3 mb-4 p-4 rounded-[20px] border transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.08) 100%)',
                borderColor: 'rgba(251,191,36,0.35)',
                boxShadow: '0 2px 12px rgba(251,191,36,0.12)'
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-amber-700 text-sm">✨ Seu trial está ativo</span>
                {expireDate && (
                  <span className="text-xs text-amber-600/80">Expira em {expireDate}</span>
                )}
              </div>
              <span className="shrink-0 text-xs font-bold px-4 py-2 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                Ativar Plano Completo →
              </span>
            </Link>
          )
        }

        if (status === 'OVERDUE' || status === 'CANCELED' || status === 'canceled') {
          return (
            <Link
              to="/cliente/assinatura"
              className="flex items-center justify-between gap-3 mb-4 p-4 rounded-[20px] border transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(220,38,38,0.06) 100%)',
                borderColor: 'rgba(239,68,68,0.30)',
                boxShadow: '0 2px 12px rgba(239,68,68,0.10)'
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-red-700 text-sm">⚠️ Assinatura vencida</span>
                <span className="text-xs text-red-600/70">Renove para voltar a assistir</span>
              </div>
              <span className="shrink-0 text-xs font-bold px-4 py-2 rounded-full text-white bg-red-600">
                Renovar Agora →
              </span>
            </Link>
          )
        }

        return null
      })()}

      <div className="flex-1 overflow-x-hidden w-full">
        <div className="relative w-full aspect-[4/5] bg-card rounded-[24px] overflow-hidden shadow-xl p-6 flex flex-col justify-end text-foreground border border-border">
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border shadow-sm cursor-pointer hover:bg-border transition-colors"
          >
            <Settings2 className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                {isActive ? 'Plano Ativo' : 'Expirado'}
              </span>
            </div>
            
            <h2 className="text-4xl font-extrabold mb-1 tracking-tight">
              {subscription?.plans?.name || 'Premium'}
            </h2>
            <p className="text-sm text-foreground/60 font-medium">
              {isActive && subscription?.expires_at 
                ? subscription.status === 'trialing' 
                  ? `Trial expira em ${hoursRemaining} horas` 
                  : `Vence em ${daysRemaining} dias (${new Date(subscription.expires_at).toLocaleDateString('pt-BR')})` 
                : 'Sem plano ativo.'}
            </p>
            
            {isActive ? (
              <div className="mt-6 flex flex-col gap-3">
                {!subscription?.dispositivo_principal ? (
                  <div className="bg-background/80 backdrop-blur-xl rounded-[24px] p-5 flex flex-col border border-border shadow-sm">
                    <h3 className="text-sm font-bold mb-4 text-center text-foreground">Onde você vai assistir?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {devices.map((device: any) => (
                        <button 
                          key={device.id} 
                          onClick={() => handleSelectDevice(device.id)}
                          disabled={selectingDevice}
                          className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-[16px] hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50 group cursor-pointer"
                        >
                          <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{device.icon || '📱'}</span>
                          <span className="text-xs font-bold text-foreground/80">{device.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-center text-foreground/40 mt-4 uppercase tracking-wider font-bold">Escolha para liberar seu acesso</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-background rounded-[24px] p-4 flex justify-between items-center border border-border">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-foreground/50 font-bold tracking-wider">Usuário M3U</span>
                        <span className="font-mono text-sm font-semibold">{profile?.email?.split('@')[0]}</span>
                      </div>
                      <button className="text-xs bg-card border border-border hover:bg-border px-4 py-2 rounded-xl font-bold transition-colors shadow-sm cursor-pointer">Copiar</button>
                    </div>
                    <div className="bg-background rounded-[24px] p-4 flex justify-between items-center border border-border">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-foreground/50 font-bold tracking-wider">Senha M3U</span>
                        <span className="font-mono text-sm font-semibold">••••••••</span>
                      </div>
                      <button className="text-xs bg-card border border-border hover:bg-border px-4 py-2 rounded-xl font-bold transition-colors shadow-sm cursor-pointer">Copiar</button>
                    </div>
                    
                    {steps.length > 0 && (
                      <div className="mt-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-primary"></span>
                          Passo a Passo de Instalação
                        </h3>
                        {steps.map((step: any) => (
                          <div key={step.id} className="bg-background/80 backdrop-blur-md rounded-[16px] p-4 border border-border flex flex-col gap-2 shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 w-max px-2 py-0.5 rounded-md">Passo {step.step_order}</span>
                            <p className="text-sm font-semibold text-foreground/90 leading-relaxed">{step.instruction}</p>
                            {step.image_url && <img src={step.image_url} alt={`Passo ${step.step_order}`} className="mt-2 rounded-xl border border-border shadow-sm max-h-48 object-cover w-full" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-4">
                <div className="p-5 bg-red-50 border border-red-200 rounded-[24px] flex flex-col items-center text-center">
                  <p className="text-sm text-red-600 font-bold mb-4">
                    Você está sem plano ativo. Assine agora para liberar seu acesso imediatamente.
                  </p>
                  <Link
                    to="/cliente/assinatura"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-base hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Ver Planos e Assinar
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Modal (Slide Over) */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-sm bg-card border-l border-border h-full p-6 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Notificações</h3>
                <button onClick={() => setIsNotificationsOpen(false)} className="h-8 w-8 rounded-full bg-border flex items-center justify-center cursor-pointer hover:bg-border/80 text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 text-foreground">
                <Bell className="w-12 h-12 mb-4" />
                <p className="text-sm font-medium">Nenhuma notificação nova</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings / Upgrade Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-md p-6 rounded-[32px] border border-border shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Configurações do Plano</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="h-8 w-8 rounded-full bg-border flex items-center justify-center cursor-pointer hover:bg-border/80 text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-background rounded-2xl p-4 border border-border flex flex-col gap-2 mb-6 text-foreground">
                <span className="text-xs uppercase font-bold text-foreground/50 tracking-wider">Telas Ativas</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold">{subscription?.plans?.max_connections || 1}</span>
                  <span className="text-sm font-medium text-foreground/60">dispositivos simultâneos</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-foreground/80 mb-2">Adicionar mais telas (R$ {subscription?.plans?.extra_screen_price || '15,00'} / tela)</p>
                <button 
                  onClick={() => {
                    console.log("Pedindo +1 tela para assinatura", subscription?.id);
                    alert("Função em beta! Isso irá atualizar sua fatura no próximo ciclo.");
                  }}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Pedir +1 Tela
                </button>
                <button 
                  onClick={() => {
                    console.log("Pedindo +2 telas para assinatura", subscription?.id);
                    alert("Função em beta! Isso irá atualizar sua fatura no próximo ciclo.");
                  }}
                  className="w-full bg-secondary text-secondary-foreground py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 border border-border cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Pedir +2 Telas
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
