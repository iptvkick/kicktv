import { createFileRoute } from '@tanstack/react-router'
import { Wallet, Plus, MonitorSmartphone, Key, Save, ChevronDown, ChevronUp, Trash2, Edit2, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'

type Plan = Tables<'plans'>

export const Route = createFileRoute('/admin/planos')({
  component: PlanosAdminPage,
})

function PlanosAdminPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    billing_cycle: 'MONTHLY',
    base_price: 0,
    extra_user_price: 0,
    is_active: true
  })
  
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchPlans()
  }, [])

  async function fetchPlans() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setPlans(data)
      }
    } catch (err) {
      console.error('Exceção ao buscar planos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este plano? Isso pode afetar assinaturas ativas.')) return
    
    const { error } = await supabase.from('plans').delete().eq('id', id)
    if (!error) {
      setPlans(plans.filter(p => p.id !== id))
    } else {
      alert('Erro ao deletar plano.')
    }
  }

  const handleEdit = (plan: Plan) => {
    setFormData({
      name: plan.name,
      billing_cycle: plan.billing_cycle,
      base_price: plan.base_price,
      extra_user_price: plan.extra_user_price,
      is_active: plan.is_active
    })
    setEditingPlanId(plan.id)
    setIsAdding(true)
  }

  const handleAddNew = () => {
    setFormData({
      name: '',
      billing_cycle: 'MONTHLY',
      base_price: 0,
      extra_user_price: 0,
      is_active: true
    })
    setEditingPlanId(null)
    setIsAdding(true)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingPlanId(null)
  }

  const handleSavePlan = async () => {
    setIsSaving(true)
    try {
      if (editingPlanId) {
        // Update
        const { data, error } = await supabase
          .from('plans')
          .update(formData)
          .eq('id', editingPlanId)
          .select()
          .single()
          
        if (error) throw error
        if (data) {
          setPlans(plans.map(p => p.id === editingPlanId ? data : p))
        }
      } else {
        // Insert
        const { data, error } = await supabase
          .from('plans')
          .insert(formData)
          .select()
          .single()
          
        if (error) throw error
        if (data) {
          setPlans([data, ...plans])
        }
      }
      
      setIsAdding(false)
      setEditingPlanId(null)
    } catch (err) {
      console.error('Erro ao salvar plano:', err)
      alert('Erro ao salvar plano.')
    } finally {
      setIsSaving(false)
    }
  }

  const cycleMap: Record<string, string> = {
    'WEEKLY': 'Semanal',
    'BIWEEKLY': 'Quinzenal',
    'MONTHLY': 'Mensal',
    'QUARTERLY': 'Trimestral',
    'SEMIANNUALLY': 'Semestral',
    'YEARLY': 'Anual'
  }

  return (
    <div className="flex flex-col gap-10 p-4 md:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground" style={{ letterSpacing: '-0.03em' }}>
            Planos de Assinatura
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl">
            Gerencie os planos locais. Eles definirão os preços base e de telas extras para o Hub de Clientes.
          </p>
        </div>
        {!isAdding && (
          <button 
            onClick={handleAddNew}
            className="group relative overflow-hidden bg-foreground text-background px-8 py-4 rounded-2xl text-base font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center gap-3 interactive"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            Criar Novo Plano
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-white backdrop-blur-xl border border-zinc-200 p-8 rounded-[32px] shadow-2xl flex flex-col gap-8 transition-all animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {editingPlanId ? 'Editar Plano' : 'Novo Plano Estratégico'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Nome Comercial</label>
              <input 
                type="text" 
                disabled={isSaving} 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="bg-white border border-zinc-200 p-4 rounded-2xl text-zinc-900 font-semibold focus-visible:outline-2 focus-visible:outline-indigo-500 transition-all disabled:opacity-50" 
                placeholder="Ex: Kick Básico" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Ciclo Asaas</label>
              <select 
                disabled={isSaving} 
                value={formData.billing_cycle} 
                onChange={e => setFormData({...formData, billing_cycle: e.target.value})} 
                className="bg-white border border-zinc-200 p-4 rounded-2xl text-zinc-900 font-semibold focus-visible:outline-2 focus-visible:outline-indigo-500 transition-all appearance-none disabled:opacity-50"
              >
                <option value="MONTHLY">Mensal</option>
                <option value="QUARTERLY">Trimestral</option>
                <option value="SEMIANNUALLY">Semestral</option>
                <option value="YEARLY">Anual</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Preço Base (R$)</label>
              <input 
                type="number" 
                disabled={isSaving} 
                value={formData.base_price} 
                onChange={e => setFormData({...formData, base_price: Number(e.target.value)})} 
                className="bg-white border border-zinc-200 p-4 rounded-2xl text-zinc-900 font-semibold text-xl focus-visible:outline-2 focus-visible:outline-indigo-500 transition-all disabled:opacity-50" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Por Tela Extra (R$)</label>
              <input 
                type="number" 
                disabled={isSaving} 
                value={formData.extra_user_price} 
                onChange={e => setFormData({...formData, extra_user_price: Number(e.target.value)})} 
                className="bg-white border border-zinc-200 p-4 rounded-2xl text-zinc-900 font-semibold text-xl focus-visible:outline-2 focus-visible:outline-indigo-500 transition-all disabled:opacity-50" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input 
              type="checkbox" 
              id="is_active"
              checked={formData.is_active}
              onChange={e => setFormData({...formData, is_active: e.target.checked})}
              className="w-5 h-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="is_active" className="text-base font-bold cursor-pointer">Plano Ativo para Vendas</label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-4 pt-6 border-t border-zinc-200">
            <button 
              onClick={handleCancel} 
              className="px-8 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-colors interactive"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSavePlan} 
              disabled={isSaving} 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_8px_16px_rgba(79,70,229,0.2)] hover:shadow-[0_12px_24px_rgba(79,70,229,0.3)] disabled:opacity-70 interactive"
            >
              {isSaving ? (
                <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Salvando...</span>
              ) : (
                <><Save className="w-5 h-5" /> Salvar Definições</>
              )}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-80 bg-zinc-100 rounded-[32px] animate-pulse"></div>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-4 bg-zinc-50 rounded-[32px] border border-dashed border-zinc-300">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
            <Wallet className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-500">Nenhum plano cadastrado.</h3>
          <p className="text-zinc-400">Crie seu primeiro plano de assinatura para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div 
              key={plan.id} 
              className={`bg-white backdrop-blur-xl border ${plan.is_active ? 'border-zinc-200' : 'border-red-200 opacity-75'} p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col group hover:border-indigo-500/50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 interactive`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shadow-inner ${plan.is_active ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-100 text-zinc-400'}`}>
                  <Wallet className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-zinc-100 text-zinc-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                    {cycleMap[plan.billing_cycle] || plan.billing_cycle}
                  </span>
                  {!plan.is_active && (
                    <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Inativo</span>
                  )}
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">{plan.name}</h2>
              
              <div className="flex flex-col mb-8">
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Preço Base</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-zinc-500">R$</span>
                  <span className="text-5xl font-extrabold tracking-tighter text-foreground">
                    {Number(plan.base_price).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-auto bg-zinc-50 p-5 rounded-[24px] border border-zinc-100 flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-2 font-semibold">
                    <MonitorSmartphone className="w-5 h-5 text-indigo-500" /> 
                    Tela Extra
                  </span>
                  <span className="font-bold text-lg">+ R$ {Number(plan.extra_user_price).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleEdit(plan)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 interactive"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(plan.id)}
                  className="w-16 flex-none bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-2xl font-bold transition-all flex items-center justify-center interactive"
                  title="Excluir Plano"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
