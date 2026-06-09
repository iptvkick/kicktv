import { LayoutDashboard, Users, CreditCard, Activity, ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Usuários Ativos", value: "1,204", icon: Users },
    { label: "Receita Mensal", value: "R$ 45.2k", icon: CreditCard },
    { label: "Trials Ativos", value: "32", icon: Activity },
    { label: "Taxa de Conversão", value: "24%", icon: ArrowUpRight },
  ];

  return (
    <div className="flex flex-col p-8 md:p-12 w-full max-w-7xl mx-auto gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#212529]">Visão Geral</h1>
        <p className="text-gray-500">Métricas e acompanhamento do SaaS. Bem-vindo ao painel de gestão.</p>
      </header>

      {/* Grid de Métricas Widescreen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className="h-8 w-8 rounded-full bg-[#f5f6f7] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#212529]" />
                </div>
              </div>
              <span className="text-3xl font-black text-[#212529] tracking-tight">{stat.value}</span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Registros Expansiva */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[#212529]">Últimos Registros & Assinaturas</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col">
              {/* Header Tabela */}
              <div className="grid grid-cols-4 border-b border-gray-50 pb-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Usuário</span>
                <span>Plano</span>
                <span>Status</span>
                <span className="text-right">Tempo</span>
              </div>
              
              {/* Linha 1 */}
              <div className="grid grid-cols-4 items-center py-3 border-b border-gray-50">
                <span className="font-bold text-sm text-[#212529]">joao_testes</span>
                <span className="text-sm text-gray-600">KickTV Premium</span>
                <div><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Ativo</span></div>
                <span className="text-right text-xs text-gray-400">Há 5 min</span>
              </div>
              
              {/* Linha 2 */}
              <div className="grid grid-cols-4 items-center py-3">
                <span className="font-bold text-sm text-[#212529]">maria123</span>
                <span className="text-sm text-gray-600">Trial 4 Horas</span>
                <div><span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-md">Trial</span></div>
                <span className="text-right text-xs text-gray-400">Há 20 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas do Servidor */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[#212529]">Status dos Servidores</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#212529]">Servidor Xtream A</span>
                <span className="text-xs text-gray-500">12ms ping • 450 usuários</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#212529]">Servidor Xtream B</span>
                <span className="text-xs text-gray-500">22ms ping • 754 usuários</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
