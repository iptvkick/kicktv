import { createFileRoute } from '@tanstack/react-router'
import { GripVertical, Youtube, Plus, Save, Tv } from 'lucide-react'

export const Route = createFileRoute('/admin/onboarding')({
  component: OnboardingAdminPage,
})

function OnboardingAdminPage() {
  const mockDevices = [
    { id: 1, name: "Smart TV (Samsung/LG)", steps: 3 },
    { id: 2, name: "TiviMate (Android)", steps: 2 },
    { id: 3, name: "Apple TV", steps: 4 },
  ]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 p-8 w-full max-w-7xl mx-auto min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Onboarding Builder</h1>
          <p className="text-foreground/60 mt-2">Personalize a lista de aparelhos que aparece na tela de "Gerar Teste" e crie tutoriais embutindo vídeos do YouTube.</p>
        </div>
        <button className="bg-primary hover:opacity-90 text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2">
          <Save className="w-4 h-4" />
          Salvar Ordem
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel Esquerdo: Lista de Aparelhos */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-foreground">Aparelhos na Landing Page</h3>
            <button className="text-foreground border border-border hover:bg-black/5 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3" /> Adicionar
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {mockDevices.map(device => (
              <div key={device.id} className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-card/90 transition-colors group">
                <GripVertical className="w-5 h-5 text-foreground/30 group-hover:text-foreground/60 cursor-grab" />
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-foreground">{device.name}</span>
                  <span className="text-xs text-foreground/50">{device.steps} Passos de Instalação</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel Direito: O Editor Visual de Passos */}
        <div className="col-span-2 bg-card border border-border rounded-[32px] p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
          
          <h3 className="font-bold text-2xl text-foreground mb-1">TiviMate (Android)</h3>
          <p className="text-foreground/50 text-sm mb-8">Construindo as telas de ajuda para este aparelho.</p>

          <div className="flex flex-col gap-6">
            {/* Passo 1 */}
            <div className="bg-background p-6 rounded-[24px] border border-border flex flex-col gap-4 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">1</div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-foreground/50 tracking-wider">Título do Passo</label>
                <input type="text" value="Baixe o TiviMate na PlayStore" className="bg-card text-foreground px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary font-medium transition-colors" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-foreground/50 tracking-wider">Descrição (Markdown)</label>
                <textarea rows={2} value="Procure por 'TiviMate IPTV Player' e instale. É o aplicativo do logo azul." className="bg-card text-foreground px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm resize-none transition-colors" />
              </div>

              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
                <label className="text-xs font-bold uppercase text-foreground/50 tracking-wider flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-500" />
                  ID do Vídeo do YouTube (Opcional)
                </label>
                <input type="text" placeholder="Ex: dQw4w9WgXcQ" value="dQw4w9WgXcQ" className="bg-card text-foreground px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary font-mono text-sm transition-colors" />
              </div>
            </div>

            <button className="border-2 border-dashed border-border text-foreground/50 hover:border-foreground/30 hover:bg-black/5 hover:text-foreground transition-all py-4 rounded-[24px] font-bold flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Adicionar Passo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

