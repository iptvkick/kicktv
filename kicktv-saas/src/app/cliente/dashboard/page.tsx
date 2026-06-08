import { Bell, Search, Settings2 } from "lucide-react";

export default function DashboardPage() {
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

        {/* Renovação Secção */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Faturas Asaas</h3>
          <div className="bg-card p-5 rounded-[20px] shadow-sm flex items-center justify-between border border-black/5">
            <div className="flex flex-col">
              <span className="font-bold">Renovação Mensal</span>
              <span className="text-sm text-foreground/60">R$ 35,00 / mês</span>
            </div>
            <button className="bg-accent text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform">
              Pagar via PIX
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
