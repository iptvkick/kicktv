import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, ArrowRight, SkipForward, FileText, Search } from 'lucide-react';
import api from '../../hooks/useApi';

interface StepVaultProps {
  onNext: (data: { vaultPath: string | null }) => void;
}

export default function StepVault({ onNext }: StepVaultProps) {
  const [vaultPath, setVaultPath] = useState('');
  const [indexing, setIndexing] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [fileCount, setFileCount] = useState(0);

  const handleIndex = async () => {
    if (!vaultPath.trim()) return;
    setIndexing(true);
    try {
      await api.post('/api/config/set', { key: 'vaultPath', value: vaultPath.trim() });
      const res = await api.post('/api/rag/index', { path: vaultPath.trim() });
      setFileCount(res.data.count ?? 0);
      setIndexed(true);
    } catch (_) {
      setIndexed(true);
      setFileCount(0);
    } finally {
      setIndexing(false);
    }
  };

  const handleSkip = () => onNext({ vaultPath: null });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h2 className="font-space font-bold text-4xl text-white">
          Memória <span style={{ color: 'var(--secondary)' }}>Vetorial</span>
        </h2>
        <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
          Conecte sua vault Obsidian para dar memória quase-perfeita aos seus agentes via RAG.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-5">
        {/* Illustration */}
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,191,0,0.05)', border: '1px solid rgba(255,191,0,0.15)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,191,0,0.12)' }}>
            <FolderOpen size={20} style={{ color: 'var(--secondary)' }} />
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <p className="font-space font-semibold text-white mb-0.5">Obsidian Vault</p>
            <p>O conteúdo dos seus <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.08)' }}>.md</code> será indexado e buscado semanticamente a cada resposta dos agentes.</p>
          </div>
        </div>

        {/* Path input */}
        <div>
          <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Caminho da Vault no sistema
          </label>
          <input
            type="text"
            value={vaultPath}
            onChange={e => setVaultPath(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleIndex()}
            placeholder="C:/Users/User/Documents/04_Vault"
            className="input-glass font-mono text-sm"
          />
          <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Windows ou WSL path. Ex: <code className="font-mono">/mnt/c/Users/User/04_Vault</code>
          </p>
        </div>

        {/* Result */}
        {indexed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(0,245,230,0.06)', border: '1px solid rgba(0,245,230,0.2)' }}
          >
            <Search size={16} style={{ color: 'var(--primary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-space font-bold text-white">{fileCount}</span> arquivos indexados no RAG.
            </span>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {!indexed ? (
            <button
              onClick={handleIndex}
              disabled={!vaultPath.trim() || indexing}
              className="btn-primary w-full"
            >
              {indexing ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  Indexando...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Indexar Vault
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => onNext({ vaultPath: vaultPath.trim() })}
              className="btn-primary w-full"
            >
              Próximo: Finalizar Setup
              <ArrowRight size={18} />
            </button>
          )}

          <button onClick={handleSkip} className="btn-ghost w-full justify-center text-sm">
            <SkipForward size={15} />
            Pular por agora (configurar depois)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
