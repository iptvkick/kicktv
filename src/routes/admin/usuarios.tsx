import { createFileRoute } from '@tanstack/react-router'
import { Users, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin/usuarios')({
  component: UsuariosAdminPage,
})

function UsuariosAdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            subscriptions (
              status,
              expires_at
            )
          `)
        if (data && !error) {
          setUsers(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
          <p className="text-zinc-500 mt-2">Visualize e gerencie os clientes da plataforma.</p>
        </div>
      </header>

      <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Search className="w-5 h-5 text-zinc-400" />
          <input type="text" placeholder="Buscar usuário por email ou ID..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Email / Nome</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status Assinatura</th>
                <th className="px-6 py-4 font-semibold">Vencimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">Carregando usuários...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-500">Nenhum usuário encontrado.</td></tr>
              ) : (
                users.map(user => {
                  const sub = user.subscriptions && user.subscriptions.length > 0 ? user.subscriptions[0] : null;
                  const status = sub?.status || 'Sem plano';
                  const expires = sub?.expires_at ? new Date(sub.expires_at).toLocaleDateString('pt-BR') : '-';
                  return (
                    <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-900">{user.full_name || 'Sem nome'}</span>
                          <span className="text-zinc-500 text-xs">{user.email || user.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md text-xs font-semibold uppercase">{user.role || 'client'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold uppercase ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-600">{expires}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
