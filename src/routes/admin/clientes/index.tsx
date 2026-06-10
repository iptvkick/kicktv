import { createFileRoute, Link } from '@tanstack/react-router'
import { Users, Search, MoreVertical, ShieldCheck, Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin/clientes/')({
  component: ClientesAdminPage,
})

function ClientesAdminPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    setLoading(true)
    try {
      // Query 1: busca todos os profiles (sem join)
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profError) throw profError

      const userIds = (profiles ?? []).map((p: any) => p.id)

      // Query 2: busca subscriptions sem join (independente de FK no PostgREST)
      let subscriptionsMap: Record<string, any> = {}
      let planIds: string[] = []

      if (userIds.length > 0) {
        const { data: subs, error: subsError } = await supabase
          .from('subscriptions')
          .select('user_id, status, next_due_date, plan_id, extra_users_count')
          .in('user_id', userIds)

        if (subsError) {
          console.warn('Aviso: falha ao buscar subscriptions:', subsError.message)
        } else {
          ;(subs ?? []).forEach((sub: any) => {
            subscriptionsMap[sub.user_id] = sub
            if (sub.plan_id) planIds.push(sub.plan_id)
          })
        }
      }

      // Query 3: busca plans sem join (independente de FK no PostgREST)
      let plansMap: Record<string, any> = {}
      const uniquePlanIds = [...new Set(planIds)]
      if (uniquePlanIds.length > 0) {
        const { data: plans, error: plansError } = await supabase
          .from('plans')
          .select('id, name')
          .in('id', uniquePlanIds)

        if (plansError) {
          console.warn('Aviso: falha ao buscar plans:', plansError.message)
        } else {
          ;(plans ?? []).forEach((plan: any) => {
            plansMap[plan.id] = plan
          })
        }
      }

      // Merge client-side usando userId e planId como chaves
      const merged = (profiles ?? []).map((p: any) => {
        const sub = subscriptionsMap[p.id] || null
        const plan = sub?.plan_id ? plansMap[sub.plan_id] || null : null
        return {
          ...p,
          subscription: sub ? { ...sub, plans: plan } : null,
        }
      })

      setClientes(merged)
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredClientes = clientes.filter(c => {
    const term = searchQuery.toLowerCase()
    return (
      (c.full_name?.toLowerCase() || '').includes(term) ||
      (c.email?.toLowerCase() || '').includes(term) ||
      (c.cpf || '').includes(term)
    )
  })

  const getStatusBadge = (status?: string) => {
    if (!status) return <span className="bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Sem Assinatura</span>
    if (status === 'ACTIVE') return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Ativa</span>
    if (status === 'OVERDUE') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"><XCircle className="w-3 h-3"/> Atrasada</span>
    if (status === 'CANCELED') return <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"><XCircle className="w-3 h-3"/> Cancelada</span>
    return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{status}</span>
  }

  return (
    <div className="flex flex-col gap-10 p-4 md:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground" style={{ letterSpacing: '-0.03em' }}>
            Hub de Clientes
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl">
            Visão geral de todos os usuários, suas assinaturas e status financeiro.
          </p>
        </div>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 pl-11 pr-4 py-4 rounded-2xl w-full md:w-80 text-sm focus-visible:outline-2 focus-visible:outline-indigo-500 transition-all font-semibold shadow-sm"
            placeholder="Buscar por nome, email ou CPF..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-zinc-500">Cliente</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-zinc-500">Contato / CPF</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-zinc-500">Plano Atual</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-zinc-500 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-zinc-500 font-semibold">Carregando clientes...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-zinc-500 font-semibold">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors interactive">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-[16px] flex items-center justify-center font-bold text-lg shadow-sm">
                          {cliente.full_name ? cliente.full_name.charAt(0).toUpperCase() : <Users className="w-5 h-5"/>}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{cliente.full_name || 'Sem Nome'}</div>
                          <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Desde {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-zinc-700 dark:text-zinc-300">{cliente.email}</div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">{cliente.cpf || 'Sem CPF'}</div>
                    </td>
                    <td className="px-6 py-5">
                      {cliente.subscription ? (
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-foreground">{cliente.subscription.plans?.name || 'Plano Desconhecido'}</span>
                          <span className="text-xs text-zinc-500">
                            {cliente.subscription.extra_users_count} tela(s) extra(s)
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-400 italic">Nenhum plano</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(cliente.subscription?.status)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        to={`/admin/clientes/${cliente.id}`}
                        className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-xl text-zinc-500 hover:text-indigo-600 hover:border-indigo-600 hover:shadow-sm transition-all group-hover:scale-105"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
