import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cliente/player")({
  component: PlayerPage,
});

function PlayerPage() {
  return (
    <main className="flex-1 flex flex-col pt-12 pb-24 items-center justify-center px-6">
      <div className="flex flex-col items-center justify-center text-center gap-6 max-w-sm w-full">
        <div className="w-24 h-24 rounded-[24px] bg-card border border-border shadow-sm flex items-center justify-center">
          <div className="w-16 h-16 rounded-[24px] bg-background border border-border flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Web Player</h1>
          <p className="text-sm text-foreground/60 leading-relaxed">
            O player de vídeo integrado está sendo preparado. Em breve você poderá assistir aos seus canais diretamente por aqui sem precisar instalar aplicativos!
          </p>
        </div>
        <button className="mt-4 bg-primary border border-border text-primary-foreground px-8 py-3 rounded-[24px] text-sm font-semibold hover:opacity-90 transition-opacity">
          Notifique-me quando lançar
        </button>
      </div>
    </main>
  );
}
