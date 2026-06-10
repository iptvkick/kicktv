import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User as UserIcon, Shield, CreditCard, RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/cliente/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  const [email, setEmail] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [openSection, setOpenSection] = useState<'pessoal' | 'pagamento' | 'seguranca' | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cpf, setCpf] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        
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
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const { data, error } = await supabase.functions.invoke('asaas-checkout', {
      body: {
        planId: subscription?.plan_id,
        serverId: subscription?.server_id,
        cpfCnpj: cpf
      }
    });
    setCheckoutLoading(false);
    if (error || data?.error) {
      alert(error?.message || data?.error || 'Erro ao gerar checkout Asaas');
    } else {
      setCheckoutResult(data);
    }
  };

  const toggleSection = (section: 'pessoal' | 'pagamento' | 'seguranca') => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <main className="flex-1 flex flex-col pt-12 pb-24 px-6 bg-background min-h-screen">
      <header className="pb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-[24px] bg-card border border-border shadow-sm flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-foreground/50" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Meu Perfil</h1>
          <p className="text-sm text-foreground/60 font-medium">{email || "Carregando..."}</p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col">
          
          {/* Dados Pessoais */}
          <button 
            onClick={() => toggleSection('pessoal')}
            className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <UserIcon className="w-5 h-5 text-foreground/70" />
              <span className="font-semibold text-foreground">Dados Pessoais</span>
            </div>
            {openSection === 'pessoal' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>
          <AnimatePresence>
            {openSection === 'pessoal' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border bg-zinc-50/50">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold text-foreground/50">Nome Completo</span>
                    <span className="text-sm font-semibold">{profile?.full_name || 'Não informado'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold text-foreground/50">Email</span>
                    <span className="text-sm font-semibold">{email}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-[1px] w-full bg-border" />

          {/* Métodos de Pagamento */}
          <button 
            onClick={() => toggleSection('pagamento')}
            className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <CreditCard className="w-5 h-5 text-foreground/70" />
              <span className="font-semibold text-foreground">Métodos de Pagamento</span>
            </div>
            {openSection === 'pagamento' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>
          <AnimatePresence>
            {openSection === 'pagamento' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border bg-zinc-50/50">
                <div className="p-5 flex flex-col gap-4">
                  <div className="bg-background p-4 rounded-xl shadow-sm flex items-center justify-between border border-border">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">Renovação Mensal</span>
                      <span className="text-sm text-foreground/60">R$ {subscription?.plans?.base_price || '35.00'} / mês</span>
                    </div>
                    <button 
                      onClick={() => setIsCheckoutOpen(true)}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      Pagar PIX
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-[1px] w-full bg-border" />

          {/* Segurança */}
          <button 
            onClick={() => toggleSection('seguranca')}
            className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-foreground/70" />
              <span className="font-semibold text-foreground">Segurança</span>
            </div>
            {openSection === 'seguranca' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>
          <AnimatePresence>
            {openSection === 'seguranca' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border bg-zinc-50/50">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">Senha de Acesso</span>
                    <span className="text-sm text-foreground/60">Altere sua senha de acesso ao painel web.</span>
                  </div>
                  <button 
                    onClick={() => alert("Função de resetar senha será implementada em breve.")}
                    className="bg-secondary text-secondary-foreground w-max px-6 py-2 rounded-xl text-xs font-bold shadow-sm border border-border hover:bg-border transition-colors cursor-pointer"
                  >
                    Redefinir Senha
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <button 
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 p-5 rounded-[24px] bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors border border-red-100 shadow-sm cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md p-6 rounded-[32px] border border-border shadow-2xl zoom-in-95">
            <h3 className="text-2xl font-bold mb-2 text-foreground">Finalizar Pagamento</h3>
            <p className="text-sm text-foreground/60 mb-6">Para gerar o seu PIX, precisamos do seu CPF ou CNPJ.</p>
            
            {checkoutResult ? (
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="w-48 h-48 bg-white p-2 rounded-xl mb-2 flex items-center justify-center shadow-inner border border-border">
                  {checkoutResult.pix?.encodedImage ? (
                    <img src={`data:image/png;base64,${checkoutResult.pix.encodedImage}`} alt="QR Code PIX" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center rounded-lg text-zinc-400 text-xs font-medium">Sem QR Code</div>
                  )}
                </div>
                
                <p className="text-sm font-semibold text-foreground">Escaneie o QR Code acima ou copie o link abaixo:</p>
                
                {checkoutResult.invoiceUrl && (
                  <a href={checkoutResult.invoiceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-bold bg-primary/10 px-4 py-2 rounded-full break-all transition-colors block text-center">
                    Link de Pagamento
                  </a>
                )}

                <button 
                  onClick={() => { setIsCheckoutOpen(false); setCheckoutResult(null); }}
                  className="mt-4 w-full bg-zinc-100 text-zinc-900 py-3 rounded-2xl font-bold hover:bg-zinc-200 transition-colors border border-border cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-foreground/50 tracking-wider">CPF ou CNPJ</label>
                  <input 
                    type="text" 
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    placeholder="000.000.000-00" 
                    className="bg-background text-foreground px-4 py-3 rounded-[16px] border border-border focus:outline-none focus:border-primary font-medium transition-colors" 
                  />
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 bg-zinc-100 text-zinc-900 py-3 rounded-2xl font-bold hover:bg-zinc-200 transition-colors border border-border cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleCheckout}
                    disabled={checkoutLoading || !cpf}
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    {checkoutLoading ? 'Gerando...' : 'Gerar PIX'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
