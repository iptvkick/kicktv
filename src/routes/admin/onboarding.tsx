import { createFileRoute } from '@tanstack/react-router'
import { MonitorPlay, GripVertical, Youtube, Plus, Save } from 'lucide-react'

export const Route = createFileRoute('/admin/onboarding')({
  component: OnboardingAdminPage,
})

function OnboardingAdminPage() {
  const mockDevices = [
    { id: 1, name: "Smart TV", steps: 3 },
    { id: 2, name: "TiviMate (Android)", steps: 2 },
    { id: 3, name: "Apple TV", steps: 4 },
  ]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Onboarding Builder</h1>
          <p className="text-zinc-500 mt-2">Personalize a lista de aparelhos que aparece na tela de "Gerar Teste" e crie tutoriais embutindo vídeos do YouTube.</p>
        </div>
        <button className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm">
          <Save className="w-4 h-4" />
          Salvar Ordem
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel Esquerdo: Lista de Aparelhos */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Aparelhos na Landing Page</h3>
            <button className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
              <Plus className="w-3 h-3" /> Adicionar
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {mockDevices.map(device => (
              <div key={device.id} className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-zinc-400 transition-all group">
                <GripVertical className="w-5 h-5 text-zinc-300 group-hover:text-zinc-500 cursor-grab" />
                <div className="flex flex-col flex-1">
                  <span className="font-bold">{device.name}</span>
                  <span className="text-xs text-zinc-500">{device.steps} Passos de Instalação</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel Direito: O Editor Visual de Passos */}
        <div className="col-span-2 bg-white rounded-[32px] border border-zinc-200 shadow-sm p-8 flex flex-col">
          <h3 className="font-bold text-xl mb-1">TiviMate (Android)</h3>
          <p className="text-zinc-500 text-sm mb-8">Construindo as telas de ajuda para este aparelho.</p>

          <div className="flex flex-col gap-6">
            {/* Passo 1 */}
            <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex flex-col gap-4 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">1</div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Título do Passo</label>
                <input type="text" value="Baixe o TiviMate na PlayStore" className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 font-medium" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Descrição (Markdown)</label>
                <textarea rows={2} value="Procure por 'TiviMate IPTV Player' e instale. É o aplicativo do logo azul." className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm resize-none" />
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-zinc-200">
                <label className="text-xs font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-500" />
                  ID do Vídeo do YouTube (Opcional)
                </label>
                <input type="text" placeholder="Ex: dQw4w9WgXcQ" value="dQw4w9WgXcQ" className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 font-mono text-sm" />
              </div>
            </div>

            <button className="border-2 border-dashed border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-800 transition-colors py-4 rounded-3xl font-semibold flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Adicionar Passo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
