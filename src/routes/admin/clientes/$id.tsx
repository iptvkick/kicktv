import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { ArrowLeft, User, CreditCard, Clock, FileText, CheckCircle2, XCircle, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/admin/clientes/$id')({
  component: ClienteXRayPage,
})

function ClienteXRayPage() {
  const { id } = Route.useParams()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    fetchXRay()
  }, [id])

  async function fetchXRay() {
    setLoading(true)
    try {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', id).single()
      setProfile(prof)

      const { data: sub } = await supabase.from('subscriptions').select('*, plans(*)').eq('user_id', id).maybeSingle()
      setSubscription(sub)

      const { data: inv } = await (supabase.from('invoices') as any).select('*').eq('user_id', id).order('created_at', { ascending: false })
      setInvoices(inv || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      case 'RECEIVED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      case 'OVERDUE': return 'text-red-500 bg-red-500/10 border-red-500/20'
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!profile) {
    return <div className="p-8 text-center text-zinc-500">Cliente não encontrado.</div>
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-white/10 pb-6">
        <Link to="/admin/clientes" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/5">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
            Raio-X: {profile.full_name || 'Sem Nome'}
          </h1>
          <p className="text-zinc-500 font-mono text-sm mt-1">ID: {profile.id}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna 1: Perfil */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-xl flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-500/30">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Perfil</h2>
              <p className="text-zinc-500 text-sm">Dados cadastrais</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">E-mail</p>
              <p className="text-lg font-medium text-foreground bg-black/20 p-3 rounded-xl border border-white/5">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">CPF</p>
              <p className="text-lg font-medium text-foreground bg-black/20 p-3 rounded-xl border border-white/5">{profile.cpf || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Criado em</p>
              <p className="text-lg font-medium text-foreground bg-black/20 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                {new Date(profile.created_at).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Coluna 2: Assinatura */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-xl flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center shadow-inner border border-cyan-500/30">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Assinatura</h2>
              <p className="text-zinc-500 text-sm">Plano atual e status</p>
            </div>
          </div>

          {subscription ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(subscription.status)}`}>
                    {subscription.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Plano</p>
                <p className="text-xl font-bold text-foreground">{subscription.plans?.name || 'N/A'}</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Telas Extras</p>
                  <p className="text-lg font-medium text-foreground">{subscription.extra_users_count}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Vencimento</p>
                  <p className="text-lg font-medium text-foreground">
                    {subscription.next_due_date ? new Date(subscription.next_due_date).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl">
              <CreditCard className="w-10 h-10 text-zinc-500 mb-3" />
              <p className="text-zinc-500 font-medium">Cliente não possui assinatura ativa.</p>
            </div>
          )}
        </motion.div>

        {/* Coluna 3: Faturas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-xl flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center shadow-inner border border-rose-500/30">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Histórico</h2>
              <p className="text-zinc-500 text-sm">Faturas geradas</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[300px] custom-scrollbar">
            {invoices.length === 0 ? (
              <div className="text-center text-zinc-500 p-6">Nenhuma fatura encontrada.</div>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="bg-black/20 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-bold text-foreground">R$ {Number(inv.amount).toFixed(2)}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(inv.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase ${getStatusColor(inv.status)}`}>
                    {inv.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
