import { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import FileTree from '../components/vault/FileTree';
import MindGraph from '../components/vault/MindGraph';
import api from '../hooks/useApi';

interface SearchResult { file: string; chunk: string; score: number; }

export default function Vault() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [indexing, setIndexing] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const r = await api.post('/api/rag/search', { query });
      setResults(r.data?.results ?? []);
    } catch (_) {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleReindex = async () => {
    setIndexing(true);
    try { await api.post('/api/rag/index', {}); } catch (_) {}
    setIndexing(false);
  };

  return (
    <AppShell>
      <PageHeader
        title="Vault"
        subtitle="Explorer da memória vetorial da agência"
        actions={
          <button onClick={handleReindex} disabled={indexing} className="btn-ghost text-sm py-2 px-4">
            <RefreshCw size={14} className={indexing ? 'animate-spin' : ''} />
            {indexing ? 'Indexando...' : 'Re-indexar'}
          </button>
        }
      />

      <div className="flex-1 flex p-6 gap-6 overflow-hidden">

        {/* File Explorer Sidebar */}
        <GlassCard className="w-64 flex-shrink-0 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="font-space font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Arquivos da Vault
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <FileTree onSelect={(path) => console.log('Selected:', path)} />
          </div>
        </GlassCard>

        {/* Main panel - Mind Graph Canvas & Search */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 w-80 shadow-xl bg-black/60 backdrop-blur-md rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-3">
              <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Busca RAG..."
                  className="w-full pl-8 pr-2 py-1.5 text-xs bg-black/40 border border-white/10 rounded-md text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button onClick={handleSearch} disabled={!query.trim() || searching} className="btn-primary text-xs px-3 py-1.5 rounded-md">
                {searching
                  ? <div className="w-3 h-3 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  : 'Buscar'
                }
              </button>
            </div>

            {results.length > 0 && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {results.map((r, i) => (
                  <div key={i} className="p-2.5 rounded-lg" style={{ background: 'rgba(0,245,230,0.04)', border: '1px solid rgba(0,245,230,0.15)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-space font-semibold" style={{ color: 'var(--primary)' }}>{r.file}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{Math.round(r.score * 100)}% match</span>
                    </div>
                    <p className="text-[11px] leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>"{r.chunk}"</p>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>

          <GlassCard className="flex-1 flex flex-col overflow-hidden relative">
            <MindGraph />
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
