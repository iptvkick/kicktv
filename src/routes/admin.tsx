import { createFileRoute, Outlet, Link, redirect } from '@tanstack/react-router'
import { Server, Settings, MonitorPlay, Wallet, Users } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight text-white">KickTV Admin</h2>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Configurações Dinâmicas</p>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 px-4 mt-6">
          <Link to="/admin/servidores" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/20 [&.active]:font-semibold">
            <Server className="w-5 h-5" />
            Servidores Xtream
          </Link>
          <Link to="/admin/planos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/20 [&.active]:font-semibold">
            <Wallet className="w-5 h-5" />
            Planos (Asaas)
          </Link>
          <Link to="/admin/onboarding" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/20 [&.active]:font-semibold">
            <MonitorPlay className="w-5 h-5" />
            Onboarding Builder
          </Link>
          <Link to="/admin/usuarios" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors [&.active]:bg-white/20 [&.active]:font-semibold">
            <Users className="w-5 h-5" />
            Gestão de Usuários
          </Link>
        </nav>
        
        <div className="p-4 mt-auto">
          <Link to="/" className="flex items-center justify-center w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm text-white/70">
            Sair do Painel
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
