export default function SuportePage() {
  return (
    <main className="flex-1 flex flex-col p-6 items-center justify-center h-full pt-20">
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <div className="h-20 w-20 rounded-full bg-black/5 flex items-center justify-center mb-2">
          <span className="text-3xl">🛠️</span>
        </div>
        <h1 className="text-2xl font-bold">Central de Suporte</h1>
        <p className="text-foreground/60">Integração do sistema Self-Healing e troca de DNS ocorrerá nas Edge Functions (Fase 4).</p>
      </div>
    </main>
  );
}
