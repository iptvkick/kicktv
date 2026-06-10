import { createFileRoute, redirect } from '@tanstack/react-router'
import { Server, Plus, ShieldAlert, ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin/servidores')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: ServidoresAdminPage,
})

function ServidoresAdminPage() {
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newServer, setNewServer] = useState({
    name: '',
    url: '',
    username: '',
    password: '',
    priority: 1,
    is_active: true
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchServers() {
      try {
        const { data, error } = await supabase
          .from('xtream_servers')
          .select('*')
          .order('priority', { ascending: true })
        
        if (error) {
          console.error('Erro ao buscar servidores:', error)
        } else if (data) {
          setServers(data)
        }
      } catch (err) {
        console.error('Exceção ao buscar servidores:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchServers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este servidor?')) return
    
    const { error } = await supabase.from('xtream_servers').delete().eq('id', id)
    if (!error) {
      setServers(servers.filter(s => s.id !== id))
    } else {
      alert('Erro ao deletar servidor.')
    }
  }

  const handleSaveServer = async () => {
    setIsSaving(true)
    try {
      const toInsert = { ...newServer, priority: servers.length + 1 }
      const { data, error } = await supabase.from('xtream_servers').insert(toInsert).select().single()
      
      if (error) {
        console.error('Erro ao salvar servidor:', error)
        alert('Erro ao criar servidor.')
      } else if (data) {
        setServers([...servers, data])
        setIsAdding(false)
        setNewServer({
          name: '',
          url: '',
          username: '',
          password: '',
          priority: 1,
          is_active: true
        })
      }
    } catch (err) {
      console.error('Exceção ao salvar servidor:', err)
      alert('Erro ao criar servidor.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servidores Xtream</h1>
          <p className="text-zinc-500 mt-2">Gerencie seu servidor principal e defina a hierarquia de fallbacks para evitar quedas.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Servidor
          </button>
        )}
      </header>

      {isAdding && (
        <div className="bg-white rounded-[24px] border border-zinc-100 shadow-sm p-6 mb-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Novo Servidor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Nome</label>
              <input type="text" disabled={isSaving} value={newServer.name} onChange={e => setNewServer({...newServer, name: e.target.value})} className="border p-2 rounded-xl text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Servidor Principal" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">URL Base</label>
              <input type="text" disabled={isSaving} value={newServer.url} onChange={e => setNewServer({...newServer, url: e.target.value})} className="border p-2 rounded-xl text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed" placeholder="http://..." />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Usuário</label>
              <input type="text" disabled={isSaving} value={newServer.username} onChange={e => setNewServer({...newServer, username: e.target.value})} className="border p-2 rounded-xl text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Senha</label>
              <input type="password" disabled={isSaving} value={newServer.password} onChange={e => setNewServer({...newServer, password: e.target.value})} className="border p-2 rounded-xl text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-xl font-semibold">Cancelar</button>
            <button onClick={handleSaveServer} disabled={isSaving} className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-semibold">
              {isSaving ? 'Salvando...' : 'Salvar Servidor'}
            </button>
          </div>
        </div>
      )}

      {/* Tabela de Servidores */}
      <div className="bg-white rounded-[24px] border border-zinc-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-500">
              <th className="p-4 font-semibold w-16 text-center">Pri.</th>
              <th className="p-4 font-semibold">Nome do Servidor</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">URL Base</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-zinc-500">Carregando servidores...</td>
              </tr>
            ) : servers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-zinc-500">Nenhum servidor cadastrado.</td>
              </tr>
            ) : (
              servers.map((srv) => (
                <tr key={srv.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex flex-col items-center gap-1">
                      <button className="text-zinc-300 hover:text-zinc-900"><ArrowUp className="w-3 h-3" /></button>
                      <span className="font-bold text-lg leading-none">{srv.priority}</span>
                      <button className="text-zinc-300 hover:text-zinc-900"><ArrowDown className="w-3 h-3" /></button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                        <Server className="w-5 h-5 text-zinc-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900">{srv.name}</span>
                        <span className="text-xs text-zinc-500">Usuário Oculto</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${srv.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${srv.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {srv.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-zinc-500">{srv.url}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(srv.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Alerta */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 text-blue-900">
        <ShieldAlert className="w-6 h-6 shrink-0 text-blue-600" />
        <div className="flex flex-col">
          <h4 className="font-bold">Como funciona a Hierarquia?</h4>
          <p className="text-sm mt-1 text-blue-800/80">Quando um cliente gera um teste grátis ou renova a assinatura, a API do KickTV bate primeiro no servidor com prioridade "1". Se ele não responder (erro 500 ou time-out), o sistema tentará automaticamente o servidor "2", e assim por diante. Suas vendas nunca param.</p>
        </div>
      </div>
    </div>
  )
}
