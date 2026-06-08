export default function SuportePage() {
  return (
    <main className="flex-1 flex flex-col pt-12 pb-24 px-6">
      <header className="pb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Central de Suporte</h1>
        <p className="text-sm text-muted-foreground">Como podemos te ajudar hoje?</p>
      </header>

      <div className="flex flex-col gap-4">
        <button className="flex flex-col items-start bg-zinc-900 border border-white/5 p-6 rounded-2xl hover:border-[#00FF66]/50 hover:bg-zinc-800 transition-all text-left shadow-lg">
          <h2 className="text-lg font-bold text-white mb-1">Dúvidas Frequentes (FAQ)</h2>
          <p className="text-sm text-white/60">Acesse nossos tutoriais e veja como instalar no seu dispositivo.</p>
        </button>

        <button className="flex flex-col items-start bg-zinc-900 border border-white/5 p-6 rounded-2xl hover:border-[#00FF66]/50 hover:bg-zinc-800 transition-all text-left shadow-lg">
          <h2 className="text-lg font-bold text-white mb-1">Contato WhatsApp</h2>
          <p className="text-sm text-white/60">Fale com um de nossos atendentes em tempo real.</p>
        </button>

        <button className="flex flex-col items-start bg-zinc-900 border border-white/5 p-6 rounded-2xl hover:border-[#00FF66]/50 hover:bg-zinc-800 transition-all text-left shadow-lg">
          <h2 className="text-lg font-bold text-white mb-1">Problemas Técnicos</h2>
          <p className="text-sm text-white/60">Relate travamentos ou canais fora do ar.</p>
        </button>
      </div>
    </main>
  );
}
