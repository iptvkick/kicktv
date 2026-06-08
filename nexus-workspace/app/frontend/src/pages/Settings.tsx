import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Download, Terminal, Cpu, Code2, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import api from '../hooks/useApi';

type EngineType = 'gemini-cli' | 'openclaw' | 'hermes';

const ENGINE_OPTIONS: { id: EngineType; label: string; icon: typeof Terminal }[] = [
  { id: 'gemini-cli', label: 'Gemini CLI', icon: Terminal },
  { id: 'openclaw',   label: 'OpenClaw',   icon: Cpu },
  { id: 'hermes',     label: 'Hermes',     icon: Code2 },
];

export default function Settings() {
  const [agencyName, setAgencyName] = useState('');
  const [engine, setEngine] = useState<EngineType>('gemini-cli');
  const [apiKey, setApiKey] = useState('');
  const [vaultPath, setVaultPath] = useState('');
  const [vaultStats, setVaultStats] = useState({ fileCount: 0, lastIndexed: '—' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current config
  useEffect(() => {
    api.get('/api/config')
      .then(r => {
        const cfg = r.data ?? {};
        if (cfg.agencyName)  setAgencyName(cfg.agencyName);
        if (cfg.engine)      setEngine(cfg.engine as EngineType);
        if (cfg.api_key)     setApiKey(cfg.api_key);
        if (cfg.vaultPath)   setVaultPath(cfg.vaultPath);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    api.get('/api/vault/files')
      .then(r => {
        const files = r.data?.files ?? [];
        setVaultStats({ fileCount: files.length, lastIndexed: files.length > 0 ? 'Recente' : '—' });
      })
      .catch(() => {});
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      const configs = [
        { key: 'agencyName', value: agencyName },
        { key: 'engine', value: engine },
        { key: 'vaultPath', value: vaultPath },
      ];
      if (apiKey) configs.push({ key: 'api_key', value: apiKey });

      // Save each config
      for (const cfg of configs) {
        await api.post('/api/config/set', cfg);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (_) {}
    setSaving(false);
  }, [agencyName, engine, apiKey, vaultPath]);

  const handleReindex = async () => {
    setIndexing(true);
    try {
      await api.post('/api/rag/index', { path: vaultPath });
    } catch (_) {}
    setIndexing(false);
  };

  const handleReset = async () => {
    if (!confirm('Tem certeza que deseja resetar toda a database? Esta ação é irreversível.')) return;
    try {
      await api.post('/api/config/set', { key: 'onboarded', value: 'false' });
      window.location.href = '/onboarding';
    } catch (_) {}
  };

  const handleExport = () => {
    api.get('/api/config').then(r => {
      const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nexus-config.json';
      a.click();
      URL.revokeObjectURL(url);
    }).catch(() => {});
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Configurações"
        subtitle="Ajuste o motor, vault e identidade da sua agência"
        actions={
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-5">
            {saving ? (
              <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <><CheckCircle2 size={15} /> Salvo!</>
            ) : (
              <><Save size={15} /> Salvar Alterações</>
            )}
          </button>
        }
      />

      <div className="p-6 space-y-6 max-w-3xl">
        {/* Save Toast */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}
          >
            <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
            <span className="text-sm font-space" style={{ color: '#4ade80' }}>Configurações salvas com sucesso!</span>
          </motion.div>
        )}

        {/* Section: Agência */}
        <GlassCard className="p-6">
          <h3 className="font-space font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Agência
          </h3>
          <div>
            <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Nome da Agência
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={e => setAgencyName(e.target.value)}
              placeholder="Minha Agência"
              className="input-glass"
            />
          </div>
        </GlassCard>

        {/* Section: Motor de Execução */}
        <GlassCard className="p-6">
          <h3 className="font-space font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Motor de Execução
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-space font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Motor Ativo
              </label>
              <div className="flex gap-3">
                {ENGINE_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const active = engine === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEngine(opt.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-space font-semibold transition-all duration-200"
                      style={active ? {
                        background: 'rgba(0,245,230,0.08)',
                        border: '1px solid rgba(0,245,230,0.25)',
                        color: 'var(--primary)',
                      } : {
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Icon size={15} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                API Key (opcional)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="••••••••••••••••"
                className="input-glass"
              />
            </div>
          </div>
        </GlassCard>

        {/* Section: Vault */}
        <GlassCard className="p-6" glow="amber">
          <div className="flex items-center gap-2 mb-4">
            <Database size={15} style={{ color: 'var(--secondary)' }} />
            <h3 className="font-space font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Vault
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Caminho da Vault
              </label>
              <input
                type="text"
                value={vaultPath}
                onChange={e => setVaultPath(e.target.value)}
                placeholder="C:\Users\...\minha-vault"
                className="input-glass"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-space font-semibold" style={{ color: 'var(--secondary)' }}>{vaultStats.fileCount}</span> arquivos indexados
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Último: {vaultStats.lastIndexed}
                </p>
              </div>
              <button onClick={handleReindex} disabled={indexing} className="btn-ghost text-xs py-2 px-4" style={{ minHeight: 'auto' }}>
                <RefreshCw size={13} className={indexing ? 'animate-spin' : ''} />
                {indexing ? 'Indexando...' : 'Re-indexar RAG'}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Section: Dados */}
        <GlassCard className="p-6">
          <h3 className="font-space font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Dados
          </h3>
          <div className="flex gap-3">
            <button onClick={handleReset} className="btn-danger flex-1 text-sm py-2.5 justify-center">
              <RotateCcw size={14} /> Resetar Database
            </button>
            <button onClick={handleExport} className="btn-ghost flex-1 text-sm py-2.5 justify-center">
              <Download size={14} /> Exportar Config
            </button>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
