import { createFileRoute, redirect } from '@tanstack/react-router'
import { Server, Plus, ShieldAlert, ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
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
  const mockServers = [
    { id: 1, name: "Xtream Master USA", priority: 1, status: "active", url: "http://master.tv" },
    { id: 2, name: "Fallback BR", priority: 2, status: "active", url: "http://br.backup.tv" },
  ]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servidores Xtream</h1>
          <p className="text-zinc-500 mt-2">Gerencie seu servidor principal e defina a hierarquia de fallbacks para evitar quedas.</p>
        </div>
        <button className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Adicionar Servidor
        </button>
      </header>

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
            {mockServers.map((srv, i) => (
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
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Ativo
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-zinc-500">{srv.url}</td>
                <td className="p-4 text-right">
                  <button className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
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
