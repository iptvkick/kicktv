import { createFileRoute } from '@tanstack/react-router'
import { Wallet, Plus, MonitorSmartphone, Key, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin/planos')({
  component: PlanosAdminPage,
})

function PlanosAdminPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: '',
    duration_months: 1,
    base_price: 0,
    extra_screen_price: 0,
    is_active: true
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('duration_months', { ascending: true })
        
        if (data) {
          setPlans(data)
        }
      } catch (err) {
        console.error('Exceção ao buscar planos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este plano?')) return
    
    const { error } = await supabase.from('subscription_plans').delete().eq('id', id)
    if (!error) {
      setPlans(plans.filter(p => p.id !== id))
    } else {
      alert('Erro ao deletar plano.')
    }
  }

  const handleSavePlan = async () => {
    setIsSaving(true)
    try {
      const { data, error } = await supabase.functions.invoke('asaas-sync', {
        body: { type: 'plan', data: newPlan }
      })
      
      if (error || data?.error) {
        console.error('Erro ao salvar plano:', error || data?.error)
        alert('Erro ao criar plano.')
      } else {
        const newPlanData = data?.plan || data
        setPlans([...plans, newPlanData])
        setIsAdding(false)
        setNewPlan({
          name: '',
          duration_months: 1,
          base_price: 0,
          extra_screen_price: 0,
          is_active: true
        })
      }
    } catch (err) {
      console.error('Exceção ao salvar plano:', err)
      alert('Erro ao criar plano.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planos & Faturas (Asaas)</h1>
          <p className="text-zinc-500 mt-2">Defina os valores dos planos base e quanto cobrar por telas extras simultâneas.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Plano
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col gap-4">
          <h2 className="text-xl font-bold">Criar Novo Plano</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Nome do Plano</label>
              <input type="text" disabled={isSaving} value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} className="border p-2 rounded-xl text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Ex: Mensal Básico" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Duração (Meses)</label>
              <input type="number" disabled={isSaving} value={newPlan.duration_months} onChange={e => setNewPlan({...newPlan, duration_months: Number(e.target.value)})} className="border p-2 rounded-xl text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Preço Base (R$)</label>
              <input type="number" disabled={isSaving} value={newPlan.base_price} onChange={e => setNewPlan({...newPlan, base_price: Number(e.target.value)})} className="border p-2 rounded-xl text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Preço Tela Extra (R$)</label>
              <input type="number" disabled={isSaving} value={newPlan.extra_screen_price} onChange={e => setNewPlan({...newPlan, extra_screen_price: Number(e.target.value)})} className="border p-2 rounded-xl text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-xl font-semibold">Cancelar</button>
            <button onClick={handleSavePlan} disabled={isSaving} className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-semibold">
              {isSaving ? 'Salvando...' : 'Salvar Plano'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-10 text-center text-zinc-500">Carregando planos...</div>
        ) : plans.length === 0 ? (
          <div className="col-span-3 py-10 text-center text-zinc-500">Nenhum plano cadastrado.</div>
        ) : (
          plans.map(plan => (
            <div key={plan.id} className="bg-card p-6 rounded-[24px] border border-border shadow-sm flex flex-col group hover:border-zinc-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-zinc-100 text-zinc-800 rounded-[16px] flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {plan.duration_months} Meses
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mt-2 mb-6">
                <span className="text-sm font-semibold text-zinc-500">R$</span>
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {plan.base_price ? Number(plan.base_price).toFixed(2) : '0.00'}
                </span>
              </div>

              <div className="mt-auto pt-6 border-t border-border flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 flex items-center gap-1.5"><MonitorSmartphone className="w-4 h-4" /> Tela Extra</span>
                  <span className="font-bold">+ R$ {plan.extra_screen_price ? Number(plan.extra_screen_price).toFixed(2) : '0.00'}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button className="flex-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 py-3 rounded-xl font-semibold transition-colors text-sm">
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(plan.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-semibold transition-colors text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
