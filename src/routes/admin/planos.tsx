import { createFileRoute } from '@tanstack/react-router'
import { Wallet, Plus, MonitorSmartphone } from 'lucide-react'

export const Route = createFileRoute('/admin/planos')({
  component: PlanosAdminPage,
})

function PlanosAdminPage() {
  const mockPlans = [
    { id: 1, name: "Plano Mensal", duration: 1, base: 35.00, extra: 10.00 },
    { id: 2, name: "Plano Trimestral", duration: 3, base: 90.00, extra: 25.00 },
    { id: 3, name: "Plano Anual", duration: 12, base: 300.00, extra: 100.00 },
  ]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planos & Faturas (Asaas)</h1>
          <p className="text-zinc-500 mt-2">Defina os valores dos planos base e quanto cobrar por telas extras simultâneas.</p>
        </div>
        <button className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Novo Plano
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPlans.map(plan => (
          <div key={plan.id} className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-sm flex flex-col group hover:border-zinc-200 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {plan.duration} Meses
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-zinc-900">{plan.name}</h2>
            <div className="flex items-baseline gap-1 mt-2 mb-6">
              <span className="text-sm font-semibold text-zinc-500">R$</span>
              <span className="text-4xl font-bold tracking-tight text-zinc-900">{plan.base.toFixed(2)}</span>
            </div>

            <div className="mt-auto pt-6 border-t border-zinc-100 flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 flex items-center gap-1.5"><MonitorSmartphone className="w-4 h-4" /> Tela Extra</span>
                <span className="font-bold">+ R$ {plan.extra.toFixed(2)}</span>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 py-3 rounded-xl font-semibold transition-colors text-sm">
              Editar Plano
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
