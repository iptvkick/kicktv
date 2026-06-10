import { createFileRoute, Link } from '@tanstack/react-router'
import { User, ShieldCheck, Mail, CreditCard, MonitorSmartphone, Receipt, Calendar, ArrowLeft, XCircle, Settings2, AlertTriangle, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin/clientes/$id')({
  component: ClienteProfilePage,
})

function ClienteProfilePage() {
  const { id } = Route.useParams()
  const [profile, setProfile] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isChangingScreens, setIsChangingScreens] = useState(false)
  const [newExtraScreens, setNewExtraScreens] = useState(0)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    setLoading(true)
    try {
      const { data: pData, error: pErr } = await supabase.from('profiles').select('*').eq('id', id).single()
      if (pErr) throw pErr
      setProfile(pData)

      const { data: sData, error: sErr } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (!sErr && sData) {
        setSubscription(sData)
        setNewExtraScreens(sData.extra_users_count || 0)
        
        const { data: invData, error: invErr } = await supabase
          .from('invoices')
          .select('*')
          .eq('subscription_id', sData.id)
          .order('due_date', { ascending: false })
        
        if (!invErr && invData) {
          setInvoices(invData)
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados do cliente:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateScreens = async () => {
    if (!subscription) return
    setIsChangingScreens(true)
    try {
      // call the Edge Function for updating subscription screens
      const { data, error } = await supabase.functions.invoke('asaas-subscription-manager', {
        body: { 
          action: 'update_screens', 
          subscription_id: subscription.id, 
          extra_screens: newExtraScreens 
        }
      })
      if (error) throw error
      
      alert('Telas atualizadas com sucesso! A cobrança foi ajustada no Asaas.')
      fetchData() // refresh
    } catch (err) {
      console.error('Erro ao atualizar telas:', err)
      alert('Erro ao atualizar telas.')
    } finally {
      setIsChangingScreens(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return
    if (!confirm('ATENÇÃO: Deseja realmente cancelar a assinatura deste cliente? Esta ação não pode ser desfeita e cancelará as cobranças no Asaas.')) return
    
    try {
      const { data, error } = await supabase.functions.invoke('asaas-subscription-manager', {
        body: { 
          action: 'cancel_subscription', 
          subscription_id: subscription.id 
        }
      })
      if (error) throw error
      
      alert('Assinatura cancelada com sucesso.')
      fetchData()
    } catch (err) {
      console.error('Erro ao cancelar assinatura:', err)
      alert('Erro ao cancelar assinatura.')
    }
  }

  const getInvoiceStatusBadge = (status: string) => {
    const map: Record<string, { label: string, classes: string }> = {
      'PENDING': { label: 'Pendente', classes: 'bg-yellow-100 text-yellow-800' },
      'RECEIVED': { label: 'Pago', classes: 'bg-emerald-100 text-emerald-800' },
      'CONFIRMED': { label: 'Confirmado', classes: 'bg-emerald-100 text-emerald-800' },
      'OVERDUE': { label: 'Atrasado', classes: 'bg-red-100 text-red-800' },
      'REFUNDED': { label: 'Reembolsado', classes: 'bg-purple-100 text-purple-800' },
    }
    const config = map[status] || { label: status, classes: 'bg-zinc-100 text-zinc-800' }
    return <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.classes}`}>{config.label}</span>
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-zinc-500 font-bold">Carregando Perfil do Cliente...</span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in">
        <h2 className="text-2xl font-bold">Cliente não encontrado</h2>
        <Link to="/admin/clientes" className="text-indigo-500 hover:underline">Voltar para a lista</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <header className="flex flex-col gap-4">
        <Link to="/admin/clientes" className="inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-600 font-semibold transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Voltar para Hub de Clientes
        </Link>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[24px] flex items-center justify-center font-black text-4xl shadow-xl shadow-indigo-500/20">
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : <User className="w-10 h-10"/>}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{profile.full_name || 'Sem Nome'}</h1>
              <div className="flex items-center gap-4 mt-2 text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4"/> {profile.email}</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> {profile.cpf || 'Sem CPF'}</span>
              </div>
            </div>
          </div>
          {profile.asaas_customer_id && (
            <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl text-xs font-mono text-zinc-500 flex items-center gap-2">
              Asaas ID: <span className="font-bold text-zinc-700 dark:text-zinc-300">{profile.asaas_customer_id}</span>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Left Column: Subscription Overview */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <section className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[32px] p-8 shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="w-6 h-6 text-indigo-500"/> Assinatura</h2>
              {subscription?.status === 'ACTIVE' && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Ativa</span>
              )}
              {subscription?.status === 'CANCELED' && (
                <span className="bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Cancelada</span>
              )}
            </div>

            {subscription ? (
              <>
                <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-[24px] border border-zinc-100 dark:border-white/5 flex flex-col gap-4">
                  <div>
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Plano Base</div>
                    <div className="text-xl font-bold">{subscription.plans?.name || 'Desconhecido'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Próximo Vencimento</div>
                    <div className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      {subscription.next_due_date ? new Date(subscription.next_due_date).toLocaleDateString('pt-BR') : 'N/A'}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-200 dark:border-white/10">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Valor Total (Mês)</div>
                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">R$ {Number(subscription.total_price).toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-3">
                      <MonitorSmartphone className="w-5 h-5 text-zinc-500" />
                      <div className="font-semibold">Telas Extras</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setNewExtraScreens(Math.max(0, newExtraScreens - 1))} className="w-8 h-8 rounded-full bg-white dark:bg-zinc-700 font-bold text-lg flex items-center justify-center shadow-sm">-</button>
                      <span className="w-6 text-center font-black text-xl">{newExtraScreens}</span>
                      <button onClick={() => setNewExtraScreens(newExtraScreens + 1)} className="w-8 h-8 rounded-full bg-white dark:bg-zinc-700 font-bold text-lg flex items-center justify-center shadow-sm">+</button>
                    </div>
                  </div>
                  {newExtraScreens !== subscription.extra_users_count && (
                    <button 
                      onClick={handleUpdateScreens}
                      disabled={isChangingScreens}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_8px_16px_rgba(79,70,229,0.2)]"
                    >
                      {isChangingScreens ? 'Atualizando Asaas...' : 'Confirmar Nova Quantidade'}
                    </button>
                  )}
                </div>

                {subscription.status !== 'CANCELED' && (
                  <button 
                    onClick={handleCancelSubscription}
                    className="mt-4 flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 p-3 rounded-xl font-semibold transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Cancelar Assinatura do Cliente
                  </button>
                )}
              </>
            ) : (
              <div className="text-zinc-500 italic py-10 text-center">Nenhuma assinatura vinculada.</div>
            )}
          </section>
        </div>

        {/* Right Column: Invoices */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <section className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[32px] p-8 shadow-xl flex flex-col gap-6 h-full">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Receipt className="w-6 h-6 text-purple-500"/> Faturas & Pagamentos</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-white/10">
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Vencimento</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Valor</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-zinc-500">ID Pagamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-white/10">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-zinc-500 font-semibold">Nenhuma fatura encontrada.</td>
                    </tr>
                  ) : (
                    invoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-4">
                          <div className="font-semibold text-foreground">
                            {new Date(invoice.due_date).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="font-bold">R$ {Number(invoice.amount).toFixed(2)}</div>
                        </td>
                        <td className="py-4">
                          {getInvoiceStatusBadge(invoice.status)}
                        </td>
                        <td className="py-4 text-xs font-mono text-zinc-500">
                          {invoice.asaas_payment_id || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
