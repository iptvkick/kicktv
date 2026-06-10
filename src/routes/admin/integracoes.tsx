import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plug, Key, Webhook, RefreshCw, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin/integracoes')({
  component: IntegracoesView,
})

function IntegracoesView() {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error', message?: string }>({ status: 'idle' })

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult({ status: 'idle' })
    try {
      const { data, error } = await supabase.functions.invoke('asaas-ping-test')
      
      if (error) {
        throw new Error(error.message)
      }
      
      if (data?.success) {
        setTestResult({ status: 'success', message: 'Conexão com Asaas estabelecida com sucesso!' })
      } else {
         setTestResult({ status: 'error', message: data?.error || 'Erro desconhecido ao testar a conexão.' })
      }
    } catch (err: any) {
      setTestResult({ status: 'error', message: err.message || 'Falha na comunicação com a Edge Function.' })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Integrações</h1>
        <p className="text-zinc-500 mt-2">Configure as chaves e webhooks de sistemas externos essenciais para o KickTV.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asaas Config Guide */}
        <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-black/5 pb-4">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
              <Plug className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Asaas (Gateway de Pagamento)</h2>
              <p className="text-sm text-zinc-500">Guia de configuração para Access Token e Webhooks</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-zinc-400" />
                  Gerar Access Token
                </h3>
                <p className="text-sm text-zinc-600 mt-1">
                  Acesse sua conta do Asaas, vá em <strong>Configurações &gt; Integrações &gt; Gerar API Key</strong>. Copie a chave gerada.
                </p>
                <div className="mt-3 p-3 bg-zinc-50 rounded-lg border border-black/5 text-sm text-zinc-500">
                  <span className="font-mono text-xs">A chave deve ser colada na tabela <code>integrations</code> do banco de dados (Provider: "asaas").</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-zinc-400" />
                  Configurar Webhooks
                </h3>
                <p className="text-sm text-zinc-600 mt-1">
                  Ainda em Integrações, vá até a aba de <strong>Webhooks</strong> para Cobranças e defina a URL da sua Edge Function.
                </p>
                <div className="mt-3 p-3 bg-zinc-50 rounded-lg border border-black/5">
                  <p className="text-xs font-semibold text-zinc-700 mb-1">URL de Produção:</p>
                  <code className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded break-all">
                    {import.meta.env.VITE_SUPABASE_URL || 'https://[SEU_PROJETO].supabase.co'}/functions/v1/asaas-webhook
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Test Panel */}
        <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
           <div className="flex items-center gap-4 border-b border-black/5 pb-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Teste de Conexão</h2>
              <p className="text-sm text-zinc-500">Valide a comunicação com a API do Asaas</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-zinc-50/50 rounded-xl border border-black/5 border-dashed">
            
            {testResult.status === 'idle' && (
               <div className="flex flex-col items-center">
                 <AlertCircle className="w-12 h-12 text-zinc-300 mb-4" />
                 <p className="text-sm text-zinc-500 max-w-xs">
                   Clique no botão abaixo para testar a comunicação entre o seu projeto e o Asaas usando a chave atual.
                 </p>
               </div>
            )}

            {testResult.status === 'success' && (
               <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                 <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-2">
                   Sucesso / Ativo
                 </span>
                 <p className="text-sm text-zinc-600">
                   {testResult.message}
                 </p>
               </div>
            )}

            {testResult.status === 'error' && (
               <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                 <XCircle className="w-12 h-12 text-rose-500 mb-4" />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 mb-2">
                   Erro de Autenticação
                 </span>
                 <p className="text-sm text-zinc-600 max-w-xs">
                   {testResult.message}
                 </p>
               </div>
            )}

          </div>

          <button 
            onClick={handleTestConnection}
            disabled={testing}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all active:scale-[0.98]"
          >
            {testing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Testando Comunicação...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Testar Conexão Asaas
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
