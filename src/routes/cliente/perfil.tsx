import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User as UserIcon, Shield, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/cliente/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  const [email, setEmail] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const [openSection, setOpenSection] = useState<'pessoal' | 'pagamento' | 'seguranca' | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editCpf, setEditCpf] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const startEditingProfile = () => {
    setEditFullName(profile?.full_name || "");
    setEditCpf(profile?.cpf || "");
    setIsEditingProfile(true);
  };

  const handleUpdateProfile = async () => {
    setUpdateLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('profiles').update({
        full_name: editFullName,
        cpf: editCpf,
      }).eq('id', user.id);
      
      if (error) {
        alert("Erro ao atualizar perfil: " + error.message);
      } else {
        setProfile({ ...profile, full_name: editFullName, cpf: editCpf });
        setIsEditingProfile(false);
      }
    }
    setUpdateLoading(false);
  };

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
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
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
                  {!isEditingProfile ? (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-xs uppercase font-bold text-foreground/50">Nome Completo</span>
                          <span className="text-sm font-semibold">{profile?.full_name || 'Não informado'}</span>
                        </div>
                        <button onClick={startEditingProfile} className="text-xs text-primary font-bold hover:underline cursor-pointer">Editar</button>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-bold text-foreground/50">CPF</span>
                        <span className="text-sm font-semibold">{profile?.cpf || 'Não informado'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-bold text-foreground/50">Email</span>
                        <span className="text-sm font-semibold text-foreground/70">{email}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase font-bold text-foreground/50">Nome Completo</label>
                        <input type="text" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} className="bg-background text-foreground px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium transition-colors" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase font-bold text-foreground/50">CPF</label>
                        <input type="text" value={editCpf} onChange={(e) => setEditCpf(e.target.value)} className="bg-background text-foreground px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-sm font-medium transition-colors" placeholder="000.000.000-00" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase font-bold text-foreground/50">Email</label>
                        <input type="text" value={email} disabled className="bg-zinc-100/50 text-foreground/50 px-3 py-2 rounded-xl border border-border text-sm font-medium cursor-not-allowed" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => setIsEditingProfile(false)} disabled={updateLoading} className="flex-1 py-2 text-xs font-bold rounded-xl bg-zinc-100 text-zinc-900 border border-border hover:bg-zinc-200 cursor-pointer">Cancelar</button>
                        <button onClick={handleUpdateProfile} disabled={updateLoading} className="flex-1 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer">
                          {updateLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </>
                  )}
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
              <span className="font-semibold text-foreground">Assinatura e Pagamentos</span>
            </div>
            {openSection === 'pagamento' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>
          <AnimatePresence>
            {openSection === 'pagamento' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border bg-zinc-50/50">
                <div className="p-5 flex flex-col gap-4">
                  <Link 
                    to="/cliente/assinatura"
                    className="bg-background p-5 rounded-2xl shadow-sm flex items-center justify-between border border-border hover:border-primary/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-base">Gerenciar Assinatura</span>
                      <span className="text-sm text-foreground/60 mt-1">Ver faturas, status do plano e PIX</span>
                    </div>
                    <span className="bg-black/5 text-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all whitespace-nowrap">
                      Abrir →
                    </span>
                  </Link>
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
    </main>
  );
}
