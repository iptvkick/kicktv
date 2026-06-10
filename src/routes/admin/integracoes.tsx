import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plug, Key, Webhook, RefreshCw, CheckCircle, XCircle, AlertCircle, Play, Shield, Save } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin/integracoes')({
  component: IntegracoesView,
})

function IntegracoesView() {
  const [testingPing, setTestingPing] = useState(false)
  const [testingWebhook, setTestingWebhook] = useState(false)
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error', message?: string }>({ status: 'idle' })

  const [asaasApiKey, setAsaasApiKey] = useState('')
  const [asaasWebhookToken, setAsaasWebhookToken] = useState('')
  const [saving, setSaving] = useState(false)
  const [isLoadingKeys, setIsLoadingKeys] = useState(true)

  useEffect(() => {
    async function loadKeys() {
      try {
        const { data, error } = await supabase
          .from('integrations')
          .select('*')
          .eq('provider', 'asaas')
          .maybeSingle()
        
        if (data) {
          setAsaasApiKey(data.api_key || (data.credentials as any)?.apiKey || '')
          setAsaasWebhookToken((data.credentials as any)?.webhookToken || '')
        }
      } catch (err) {
        console.error('Failed to load integrations:', err)
      } finally {
        setIsLoadingKeys(false)
      }
    }
    loadKeys()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('integrations')
        .upsert(
          {
            provider: 'asaas',
            api_key: asaasApiKey,
            credentials: { apiKey: asaasApiKey, webhookToken: asaasWebhookToken }
          },
          { onConflict: 'provider' }
        )
      
      if (error) throw error
      alert('Credenciais salvas com sucesso!')
    } catch (err: any) {
      alert('Erro ao salvar credenciais: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async () => {
    setTestingPing(true)
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
      setTestingPing(false)
    }
  }

  const handleSimulateWebhook = async () => {
    setTestingWebhook(true)
    setTestResult({ status: 'idle' })
    try {
      const { data, error } = await supabase.functions.invoke('asaas-webhook', { 
        body: { event: 'PAYMENT_CONFIRMED' },
        headers: { 'asaas-access-token': asaasWebhookToken }
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      if (data?.error) {
        throw new Error(data.error)
      }
      
      setTestResult({ status: 'success', message: 'Sucesso de Recebimento! Webhook processado.' })
    } catch (err: any) {
      setTestResult({ status: 'error', message: err.message || 'Erro de Autenticação / Falha no Webhook.' })
    } finally {
      setTestingWebhook(false)
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
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Key className="w-4 h-4 text-zinc-400" />
                  Access Token (API Key)
                </h3>
                <p className="text-sm text-zinc-600 mt-1">
                  Acesse sua conta do Asaas, vá em <strong>Configurações &gt; Integrações &gt; Gerar API Key</strong>.
                </p>
                <div className="mt-3">
                  <input
                    type="password"
                    placeholder="$aact_..."
                    value={asaasApiKey}
                    onChange={(e) => setAsaasApiKey(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold text-sm">2</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-zinc-400" />
                  Configurar Webhooks & Eventos
                </h3>
                <p className="text-sm text-zinc-600 mt-1">
                  Em <strong>Webhooks</strong>, defina a URL abaixo e marque os seguintes eventos obrigatórios:
                </p>
                <div className="mt-3 p-3 bg-zinc-50 rounded-lg border border-black/5 mb-3">
                  <p className="text-xs font-semibold text-zinc-700 mb-1">URL de Produção:</p>
                  <code className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded break-all">
                    {import.meta.env.VITE_SUPABASE_URL || 'https://[SEU_PROJETO].supabase.co'}/functions/v1/asaas-webhook
                  </code>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded-md text-xs font-medium border border-zinc-200">PAYMENT_RECEIVED</span>
                  <span className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded-md text-xs font-medium border border-zinc-200">PAYMENT_CONFIRMED</span>
                  <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded-md text-xs font-medium border border-rose-100">PAYMENT_OVERDUE</span>
                  <span className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-100">PAYMENT_DELETED</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold text-sm">3</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zinc-400" />
                  Segurança do Webhook (Token)
                </h3>
                <p className="text-sm text-zinc-600 mt-1">
                  Copie o <strong>Token de Autenticação</strong> gerado nas configurações de webhook do Asaas para garantir que apenas o Asaas possa chamar nossa URL.
                </p>
                <div className="mt-3">
                  <input
                    type="password"
                    placeholder="whsec_..."
                    value={asaasWebhookToken}
                    onChange={(e) => setAsaasWebhookToken(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Save Action */}
            <div className="pt-4 border-t border-black/5">
              <button 
                onClick={handleSave}
                disabled={saving || isLoadingKeys}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all active:scale-[0.98]"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Credenciais
                  </>
                )}
              </button>
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
                   Clique nos botões abaixo para testar a conexão com o Asaas ou simular o recebimento de um Webhook.
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
                   Erro / Falha
                 </span>
                 <p className="text-sm text-zinc-600 max-w-xs">
                   {testResult.message}
                 </p>
               </div>
            )}

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleTestConnection}
              disabled={testingPing || testingWebhook}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all active:scale-[0.98]"
            >
              {testingPing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Testar Conexão
                </>
              )}
            </button>
            
            <button 
              onClick={handleSimulateWebhook}
              disabled={testingPing || testingWebhook}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all active:scale-[0.98]"
            >
              {testingWebhook ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Simulando...
                </>
              ) : (
                <>
                  <Webhook className="w-5 h-5" />
                  Simular Webhook
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
