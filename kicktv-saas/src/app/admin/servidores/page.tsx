import { Server, Activity, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function ServidoresPage() {
  const supabase = await createClient();

  // Buscar Servidores
  const { data: serversData, error: serversError } = await supabase
    .from("servers")
    .select("*")
    .order("created_at", { ascending: true });
    
  // Fallback
  const servers = (!serversError && serversData && serversData.length > 0) ? serversData : [
    { id: '1', nome: 'Servidor BR Principal (Fallback)', url_painel: 'painel.kicktv.com.br', ping: 12, status: 'online', limite_usuarios: 2000 },
    { id: '2', nome: 'Painel USA 1 (Fallback)', url_painel: 'painel-us.kicktv.com', ping: 45, status: 'online', limite_usuarios: 500 }
  ];

  return (
    <div className="flex flex-col gap-8 p-8 md:p-12 w-full max-w-7xl mx-auto mt-4 sm:mt-16 md:mt-0">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Servidores Xtream</h1>
          <p className="text-sm text-gray-500 mt-1">Monitore e gerencie a saúde dos seus painéis de IPTV e conexões Xtream.</p>
        </div>
        <button className="bg-[#212529] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Novo Servidor
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {servers.map((server: any) => (
          <div key={server.id} className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
            
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <Server className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg text-gray-900 leading-none">{server.nome}</h3>
                <span className="text-sm text-gray-500 font-medium">{server.url_painel}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-12 w-full sm:w-auto bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-xl">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${server.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
                  <span className={`text-sm font-bold capitalize ${server.status === 'online' ? 'text-emerald-700' : 'text-red-700'}`}>
                    {server.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ping</span>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">{server.ping} ms</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Limite</span>
                <span className="text-sm font-bold text-gray-700">{server.limite_usuarios} users</span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex justify-end">
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                Gerenciar
              </button>
            </div>
            
          </div>
        ))}

        {servers.length === 0 && (
          <div className="flex-1 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-center text-gray-400">
              <Server className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium text-gray-900 mb-1">Nenhum servidor encontrado</p>
              <p className="text-sm">Cadastre o seu primeiro painel Xtream clicando em "Novo Servidor".</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
