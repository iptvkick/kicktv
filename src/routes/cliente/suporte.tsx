import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, HelpCircle, AlertTriangle, ArrowRight, Headset } from "lucide-react";

export const Route = createFileRoute("/cliente/suporte")({
  component: SuportePage,
});

function SuportePage() {
  return (
    <main className="flex-1 flex flex-col pt-12 pb-24 px-6 bg-background">
      <header className="pb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-[24px] bg-card border border-border shadow-sm flex items-center justify-center">
          <Headset className="w-8 h-8 text-foreground/50" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Central de Suporte</h1>
          <p className="text-sm text-foreground/60 font-medium">Como podemos te ajudar hoje?</p>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        
        <a 
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-500">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Chamar no WhatsApp</h2>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-foreground/80 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-foreground/60 text-sm ml-13">
            Atendimento humano e rápido para assinantes.
          </p>
        </a>

        <button 
          className="text-left flex flex-col p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Dúvidas Frequentes</h2>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-foreground/80 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-foreground/60 text-sm ml-13">
            Tutoriais de instalação e perguntas comuns.
          </p>
        </button>

        <button 
          className="text-left flex flex-col p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Relatar Instabilidade</h2>
            </div>
            <ArrowRight className="w-5 h-5 text-foreground/40 group-hover:text-foreground/80 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-foreground/60 text-sm ml-13">
            Canais travando ou fora do ar? Avise a engenharia.
          </p>
        </button>

      </div>
    </main>
  );
}

