export default function PlayerPage() {
  return (
    <main className="flex-1 flex flex-col pt-12 pb-24 items-center justify-center px-6">
      <div className="flex flex-col items-center justify-center text-center gap-6 max-w-sm w-full">
        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 shadow-[0_0_30px_rgba(0,255,102,0.1)] flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00FF66]/20 to-black flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00FF66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-white">Web Player</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O player de vídeo integrado está sendo preparado. Em breve você poderá assistir aos seus canais diretamente por aqui sem precisar instalar aplicativos!
          </p>
        </div>
        <button className="mt-4 bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-white/10 transition-all">
          Notifique-me quando lançar
        </button>
      </div>
    </main>
  );
}
