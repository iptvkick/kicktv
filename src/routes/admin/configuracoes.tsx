import { createFileRoute } from '@tanstack/react-router'
import { Settings } from 'lucide-react'

export const Route = createFileRoute('/admin/configuracoes')({
  component: ConfigsAdminPage,
})

function ConfigsAdminPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações Gerais</h1>
          <p className="text-foreground/60 mt-2">Ajustes gerais do sistema KickTV.</p>
        </div>
      </header>

      <div className="bg-card p-8 rounded-[24px] border border-border shadow-sm max-w-2xl flex flex-col items-center justify-center text-center gap-4 py-16">
        <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center">
          <Settings className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Nenhuma configuração pendente</h2>
        <p className="text-foreground/60 max-w-sm">
          As configurações de integração com o Asaas e webhooks foram movidas para a página de <strong>Integrações</strong> no menu lateral.
        </p>
      </div>
    </div>
  )
}
