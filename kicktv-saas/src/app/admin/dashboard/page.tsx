import { Users, CreditCard, Activity, ArrowUpRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Buscar Usuários Ativos (status = 'ativo')
  const { count: ativosCount } = await supabase
    .from("iptv_subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "ativo");

  // Buscar Trials Ativos (status = 'trial')
  const { count: trialsCount } = await supabase
    .from("iptv_subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "trial");

  // Buscar Receita Mensal
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { data: payments } = await supabase
    .from("payments")
    .select("valor")
    .eq("status", "pago")
    .gte("created_at", startOfMonth.toISOString());
    
  const receita = payments?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0;

  // Buscar Últimos Registros
  const { data: ultimosRegistros } = await supabase
    .from("iptv_subscriptions")
    .select(`
      *,
      profiles (
        nome
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  // Buscar Servidores
  const { data: serversData, error: serversError } = await supabase
    .from("servers")
    .select("*")
    .order("created_at", { ascending: true });
    
  // Fallback silencioso caso a tabela servers ainda não tenha sido criada no banco
  const servers = (!serversError && serversData && serversData.length > 0) ? serversData : [
    { id: '1', nome: 'Servidor BR Principal (Fallback)', url_painel: 'painel.kicktv.com.br', ping: 12, status: 'online' },
    { id: '2', nome: 'Painel USA 1 (Fallback)', url_painel: 'painel-us.kicktv.com', ping: 22, status: 'online' }
  ];

  const totalUsuarios = (ativosCount || 0) + (trialsCount || 0);
  const taxaConversao = totalUsuarios > 0 ? Math.round(((ativosCount || 0) / totalUsuarios) * 100) : 0;

  const stats = [
    { label: "Usuários Ativos", value: ativosCount?.toString() || "0", icon: Users },
    { label: "Receita Mensal", value: `R$ ${receita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: CreditCard },
    { label: "Trials Ativos", value: trialsCount?.toString() || "0", icon: Activity },
    { label: "Taxa de Conversão", value: `${taxaConversao}%`, icon: ArrowUpRight },
  ];

  function getStatusStyle(status: string) {
    switch (status) {
      case 'ativo': return "bg-emerald-100 text-emerald-700";
      case 'trial': return "bg-amber-100 text-amber-700";
      case 'bloqueado': return "bg-red-100 text-red-700";
      case 'vencido': return "bg-gray-100 text-gray-700";
      default: return "bg-blue-100 text-blue-700";
    }
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) return `Há ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Há ${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)} dias atrás`;
  }

  return (
    <div className="flex flex-col p-8 md:p-12 w-full max-w-7xl mx-auto gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Visão Geral</h1>
        <p className="text-gray-500">Métricas e acompanhamento do SaaS. Bem-vindo ao painel de gestão.</p>
      </header>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <span className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Registros */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900">Últimos Registros & Assinaturas</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 overflow-hidden">
            <div className="flex flex-col w-full overflow-x-auto">
              <div className="min-w-[500px]">
                <div className="grid grid-cols-4 border-b border-gray-50 pb-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span>Usuário</span>
                  <span>Plano</span>
                  <span>Status</span>
                  <span className="text-right">Tempo</span>
                </div>
                
                {(!ultimosRegistros || ultimosRegistros.length === 0) ? (
                  <div className="py-8 text-center text-gray-400 text-sm">Nenhum registro encontrado.</div>
                ) : (
                  ultimosRegistros.map((registro: any) => (
                    <div key={registro.id} className="grid grid-cols-4 items-center py-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <span className="font-bold text-sm text-gray-900 truncate pr-2">
                        {registro.profiles?.nome || registro.xtream_username}
                      </span>
                      <span className="text-sm text-gray-600 truncate pr-2">
                        {registro.url_servidor.includes('painel') ? 'Premium' : 'Básico'}
                      </span>
                      <div>
                        <span className={`${getStatusStyle(registro.status)} text-xs font-bold px-2.5 py-1 rounded-md capitalize`}>
                          {registro.status}
                        </span>
                      </div>
                      <span className="text-right text-xs text-gray-400 whitespace-nowrap">
                        {formatTimeAgo(registro.created_at)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Servidores */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900">Status dos Servidores</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-5">
            {servers.map((server: any) => (
              <div key={server.id} className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full ${server.status === 'online' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-gray-900">{server.nome}</span>
                  <span className="text-xs text-gray-500">{server.ping}ms ping • {server.url_painel}</span>
                </div>
              </div>
            ))}
            
            <button className="mt-2 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
