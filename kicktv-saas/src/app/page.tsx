import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Top Navigation */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Olá, Visitante</h1>
          <p className="text-sm text-foreground/60">Bem-vindo ao KickTV SaaS</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-foreground/10 overflow-hidden">
          {/* Avatar Placeholder */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 flex-1 flex flex-col gap-8">
        
        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {["Sua Assinatura", "Faturas Asaas", "Suporte", "Player"].map((item, i) => (
            <button
              key={item}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-accent text-white"
                  : "bg-white text-foreground shadow-sm"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Featured Card */}
        <div className="relative w-full aspect-[4/5] bg-card rounded-3xl overflow-hidden shadow-sm p-6 flex flex-col justify-end text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black" />
          <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            {/* Heart/Favorite Icon Placeholder */}
            <span className="text-xl">📺</span>
          </div>
          
          <div className="relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider mb-2 block text-white/80">KickTV Premium</span>
            <h2 className="text-3xl font-bold mb-2">Assinatura Inativa</h2>
            <div className="flex justify-between items-center mt-6">
              <button className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold w-full">
                Gerar Teste Grátis
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 bg-accent rounded-full flex items-center justify-around px-6 shadow-xl">
        <div className="h-8 w-8 rounded-full bg-white/20" />
        <div className="h-8 w-8 rounded-full bg-white/0" />
        <div className="h-8 w-8 rounded-full bg-white/0" />
        <div className="h-4 w-4 rounded-full flex flex-wrap gap-1 justify-center items-center">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
