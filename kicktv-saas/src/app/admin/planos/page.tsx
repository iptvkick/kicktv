import { Plus, MonitorPlay, Zap, Calendar, Package } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function PlanosPage() {
  const supabase = await createClient();

  // Buscar Planos reais
  const { data: plansData, error: plansError } = await supabase
    .from("plans")
    .select("*")
    .order("preco", { ascending: true });

  // Fallback silencioso (caso a migração não tenha rodado)
  const plans = (!plansError && plansData && plansData.length > 0) ? plansData : [
    { id: '1', nome: 'Básico 1 Tela', descricao: 'Plano ideal para celular e TV no quarto.', preco: 35.00, duracao_meses: 1, limite_telas: 1, is_active: true },
    { id: '2', nome: 'Ouro 2 Telas', descricao: 'Compartilhe com a família sem cortes.', preco: 45.00, duracao_meses: 1, limite_telas: 2, is_active: true },
    { id: '3', nome: 'Diamante 4 Telas', descricao: 'Liberdade total para todos os dispositivos da casa.', preco: 65.00, duracao_meses: 1, limite_telas: 4, is_active: true }
  ];

  return (
    <div className="flex flex-col gap-8 p-8 md:p-12 w-full max-w-7xl mx-auto mt-4 sm:mt-16 md:mt-0">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Planos e Precificação</h1>
          <p className="text-sm text-gray-500 mt-1">Crie e edite os pacotes que os seus clientes vão assinar.</p>
        </div>
        <button className="bg-[#212529] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm interactive hover-lift">
          <Plus className="w-4 h-4" />
          Novo Plano
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan: any) => (
          <div key={plan.id} className="relative glass-panel rounded-3xl p-8 flex flex-col justify-between interactive hover-lift overflow-hidden group">
            
            {/* Decoração sutil de fundo */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-none">{plan.nome}</h3>
                    <span className={`text-xs font-bold uppercase tracking-wider ${plan.is_active ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {plan.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 h-10">
                {plan.descricao || 'Sem descrição.'}
              </p>

              <div className="flex items-baseline gap-1 my-2">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">R$</span>
                <span className="text-5xl font-black text-gray-900 tracking-tight">{plan.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span className="text-sm font-medium text-gray-500 ml-1">/{plan.duracao_meses === 1 ? 'mês' : `${plan.duracao_meses} meses`}</span>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <MonitorPlay className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600"><strong>{plan.limite_telas}</strong> {plan.limite_telas === 1 ? 'Tela Simultânea' : 'Telas Simultâneas'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Duração de <strong>{plan.duracao_meses}</strong> {plan.duracao_meses === 1 ? 'Mês' : 'Meses'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-blue-600">Ativação Imediata</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-4">
              <button className="w-full py-3 rounded-xl border border-gray-200 bg-white/50 text-sm font-bold text-gray-700 hover:bg-white hover:border-gray-300 transition-colors">
                Editar Plano
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
