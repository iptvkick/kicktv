import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Tv, Smartphone, Monitor } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const devices = [
    { id: "tv", name: "Smart TV", icon: Tv, desc: "Samsung, LG, Roku, Android TV" },
    { id: "mobile", name: "Celular / Tablet", icon: Smartphone, desc: "iPhone, iPad, Android" },
    { id: "pc", name: "Computador", icon: Monitor, desc: "Windows, Mac, Navegador Web" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">KickTV</h1>
        <Link to="/cliente/dashboard" className="text-sm font-semibold bg-white px-4 py-2 rounded-full shadow-sm">
          Login
        </Link>
      </header>

      <main className="px-6 flex-1 flex flex-col pt-4 pb-32">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight leading-tight mb-4">
            A nova era do <br /> entretenimento.
          </h2>
          <p className="text-foreground/70 text-lg">
            Sem travamentos, sem dor de cabeça. Escolha onde vai assistir e receba seu teste grátis agora.
          </p>
        </div>

        {/* Onboarding Devices */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-2">Onde você quer assistir?</h3>
          
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <button
                key={device.id}
                className="bg-card p-5 rounded-[24px] shadow-sm flex items-center gap-4 border border-black/5 hover:border-black/10 transition-colors text-left group relative overflow-hidden"
              >
                <div className="h-14 w-14 rounded-full bg-background flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-lg">{device.name}</span>
                  <span className="text-sm text-foreground/60">{device.desc}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-accent text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity absolute right-6">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            )
          })}
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pb-8">
        <Link to="/cliente/dashboard" className="w-full bg-accent text-white h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform">
          Gerar Teste Grátis (4 Horas)
        </Link>
      </div>
    </div>
  );
}
