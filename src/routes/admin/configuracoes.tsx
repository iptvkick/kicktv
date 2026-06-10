import { createFileRoute } from '@tanstack/react-router'
import { Key, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin/configuracoes')({
  component: ConfigsAdminPage,
})

function ConfigsAdminPage() {
  const [credentials, setCredentials] = useState({
    sandbox_key: '',
    production_key: '',
    environment: 'sandbox'
  })
  const [activeTab, setActiveTab] = useState<'sandbox' | 'production'>('sandbox')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    async function fetchIntegration() {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('provider', 'asaas')
        .maybeSingle()
      
      if (data && !error && data.credentials) {
        // Tipando como 'any' para extrair os dados do JSONB de forma segura por enquanto
        const creds = data.credentials as any
        setCredentials({
          sandbox_key: creds.sandbox_key || '',
          production_key: creds.production_key || '',
          environment: creds.environment || 'sandbox'
        })
        setActiveTab(creds.environment || 'sandbox')
      }
      setLoading(false)
    }
    fetchIntegration()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    
    const { error } = await supabase
      .from('integrations')
      .upsert({ provider: 'asaas', credentials, is_active: true }, { onConflict: 'provider' })
      
    if (error) {
      alert('Erro ao salvar chave Asaas')
      console.error(error)
    } else {
      alert('Configurações do Asaas salvas com sucesso!')
    }
    setSaving(false)
  }

  const handleTest = async () => {
    setTesting(true)
    const apiKey = credentials.environment === 'sandbox' ? credentials.sandbox_key : credentials.production_key
    
    if (!apiKey) {
      alert(`Por favor, insira a chave de ${credentials.environment} antes de testar.`)
      setTesting(false)
      return
    }

    const { data, error } = await supabase.functions.invoke('asaas-ping', {
      body: {
        environment: credentials.environment,
        apiKey: apiKey
      }
    })
    setTesting(false)

    if (error || data?.error) {
      alert(`Erro na conexão com Asaas: ${error?.message || data?.error}`)
    } else {
      alert(`Conexão Asaas (${credentials.environment}) bem sucedida!`)
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações e Integrações</h1>
          <p className="text-foreground/60 mt-2">Gerencie suas chaves de API e conexões externas.</p>
        </div>
      </header>

      <div className="bg-card p-8 rounded-[24px] border border-border shadow-sm max-w-2xl">
        <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-[16px] flex items-center justify-center shrink-0">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Asaas (Pagamentos)</h2>
              <p className="text-sm text-foreground/60">Configure as chaves e o ambiente de integração.</p>
            </div>
          </div>

          {!loading && (
            <label className="flex items-center cursor-pointer gap-2 bg-background px-4 py-2 rounded-xl border border-border">
              <span className="text-sm font-bold text-foreground/70">Ambiente:</span>
              <span className="text-xs font-bold uppercase text-foreground/40">{credentials.environment === 'production' ? 'Prod' : 'Sand'}</span>
              <div className="relative ml-2">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={credentials.environment === 'sandbox'}
                  onChange={(e) => setCredentials({...credentials, environment: e.target.checked ? 'sandbox' : 'production'})}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${credentials.environment === 'sandbox' ? 'bg-primary' : 'bg-red-500'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${credentials.environment === 'sandbox' ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
          )}
        </div>

        {loading ? (
          <div className="text-sm text-foreground/50 py-4">Carregando configurações...</div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 bg-background p-1 rounded-xl mb-2 border border-border w-fit">
              <button 
                onClick={() => setActiveTab('sandbox')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'sandbox' ? 'bg-card text-foreground shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
              >
                Sandbox
              </button>
              <button 
                onClick={() => setActiveTab('production')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'production' ? 'bg-card text-foreground shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
              >
                Produção
              </button>
            </div>

            {activeTab === 'sandbox' ? (
              <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                <label className="text-xs font-bold uppercase text-foreground/50 tracking-wider">Sandbox API Key (Access Token)</label>
                <input 
                  type="password" 
                  value={credentials.sandbox_key}
                  onChange={(e) => setCredentials({...credentials, sandbox_key: e.target.value})}
                  placeholder="Ex: $aact_YTU5YTE0M..." 
                  className="bg-background text-foreground px-4 py-3 rounded-[16px] border border-border focus:outline-none focus:border-primary font-mono text-sm transition-colors w-full" 
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                <label className="text-xs font-bold uppercase text-foreground/50 tracking-wider">Production API Key (Access Token)</label>
                <input 
                  type="password" 
                  value={credentials.production_key}
                  onChange={(e) => setCredentials({...credentials, production_key: e.target.value})}
                  placeholder="Ex: $aact_YTU5YTE0M..." 
                  className="bg-background text-foreground px-4 py-3 rounded-[16px] border border-red-200 focus:outline-none focus:border-red-500 font-mono text-sm transition-colors w-full" 
                />
              </div>
            )}
            
            <div className="flex gap-3 mt-4">
              <button 
                onClick={handleTest}
                disabled={testing}
                className="bg-secondary text-secondary-foreground border border-border px-6 py-3 rounded-[24px] text-sm font-bold shadow-sm hover:bg-border transition-colors flex items-center justify-center gap-2 w-fit disabled:opacity-50"
              >
                {testing ? 'Testando...' : 'Testar Conexão Asaas'}
              </button>
              
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-[24px] text-sm font-bold shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-fit disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
