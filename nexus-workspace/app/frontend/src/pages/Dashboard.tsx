import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, RefreshCw, Zap, Database, Activity } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import api from '../hooks/useApi';

/* ─── Types ──────────────────────────────────────────── */
interface Agent { id: string; name: string; role: string; }
interface Mission { id: string; title: string; agentId: string; status: string; progress?: number; }
interface FeedLine { ts: string; text: string; type: 'info' | 'success' | 'warn' | 'error'; }

/* ─── Agency Map ─────────────────────────────────────── */
function AgencyMap({ agents }: { agents: Agent[] }) {
  const manager = agents.find(a => a.role === 'manager') ?? { id: 'm', name: 'Principal (Manager)', role: 'manager' };
  const workers = agents.filter(a => a.role !== 'manager');

  return (
    <div className="relative w-full" style={{ minHeight: 260 }}>
      {/* Manager node */}
      <div className="flex justify-center mb-6">
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="relative flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(0,245,230,0.2), rgba(0,180,216,0.1))',
              border: '1px solid rgba(0,245,230,0.4)',
              boxShadow: '0 0 24px rgba(0,245,230,0.2)',
            }}
          >
            <div className="dot-pulse teal absolute -top-1 -right-1" />
            <span className="text-2xl">🤖</span>
          </div>
          <span className="text-xs font-space font-semibold" style={{ color: 'var(--primary)' }}>
            {manager.name}
          </span>
        </motion.div>
      </div>

      {/* SVG connector lines */}
      {workers.length > 0 && (
        <svg
          className="absolute left-0 w-full"
          style={{ top: 72, height: workers.length > 0 ? 80 : 0, pointerEvents: 'none' }}
          preserveAspectRatio="none"
        >
          {workers.map((_, i) => {
            const total = workers.length;
            const pct = (i + 1) / (total + 1);
            const x = `${pct * 100}%`;
            return (
              <line
                key={i}
                x1="50%" y1="0"
                x2={x} y2="70"
                stroke="rgba(0,245,230,0.3)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                className="connector-line"
              />
            );
          })}
        </svg>
      )}

      {/* Worker nodes */}
      {workers.length > 0 ? (
        <div className="flex justify-around mt-16">
          {workers.map(w => (
            <motion.div
              key={w.id}
              whileHover={{ scale: 1.04 }}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                }}
              >
                <span className="text-xl">⚙️</span>
              </div>
              <span className="text-xs font-space" style={{ color: 'var(--text-muted)', maxWidth: 80, textAlign: 'center' }}>
                {w.name}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-16">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Nenhum agente worker. <a href="/agents" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Criar agente →</a>
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Mission Row ────────────────────────────────────── */
function MissionRow({ mission, agentName }: { mission: Mission; agentName: string }) {
  const variant = mission.status === 'running' ? 'running'
    : mission.status === 'done' ? 'done'
    : mission.status === 'error' ? 'error'
    : 'idle';

  return (
    <div
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 hover:bg-white/[0.03] group"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-space font-medium text-white truncate">{mission.title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{agentName}</p>
      </div>
      {typeof mission.progress === 'number' && (
        <div className="w-24 hidden sm:block">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${mission.progress}%` }} />
          </div>
          <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{mission.progress}%</p>
        </div>
      )}
      <Badge variant={variant} />
    </div>
  );
}

/* ─── Context Feed ───────────────────────────────────── */
function ContextFeed({ lines }: { lines: FeedLine[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  const colors = { info: 'var(--primary)', success: '#4ade80', warn: 'var(--secondary)', error: '#f87171' };

  return (
    <div
      ref={ref}
      className="font-mono text-xs space-y-1 overflow-y-auto"
      style={{ maxHeight: 240, lineHeight: 1.6 }}
    >
      {lines.map((l, i) => (
        <div key={i} className="flex gap-2">
          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{l.ts}</span>
          <span style={{ color: colors[l.type] ?? 'var(--text-secondary)' }}>{l.text}</span>
        </div>
      ))}
      <span style={{ color: 'var(--primary)' }} className="animate-blink">▋</span>
    </div>
  );
}

/* ─── Dashboard Page ─────────────────────────────────── */
export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [feedLines, setFeedLines] = useState<FeedLine[]>([
    { ts: now(), text: 'ENV System initialized.', type: 'info' },
    { ts: now(), text: 'Backend API online.', type: 'success' },
  ]);
  const [ragStatus] = useState({ coverage: 0, lastFile: '—' });
  const [vaultFiles, setVaultFiles] = useState<{name: string; path: string; size?: number}[]>([]);
  const [loading, setLoading] = useState(true);

  function now() { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }

  useEffect(() => {
    Promise.all([
      api.get('/api/agents').catch(() => ({ data: [] })),
      api.get('/api/missions').catch(() => ({ data: [] })),
      api.get('/api/vault/files').catch(() => ({ data: { files: [] } })),
    ]).then(([ag, ms, vf]) => {
      setAgents(ag.data ?? []);
      setMissions(ms.data ?? []);
      setVaultFiles((vf.data?.files ?? []).slice(0, 5));
      setLoading(false);
    });

    // Poll feed
    const interval = setInterval(() => {
      api.get('/api/feed/latest').then(r => {
        if (r.data?.lines) setFeedLines(prev => [...prev.slice(-80), ...r.data.lines]);
      }).catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const agentMap = Object.fromEntries(agents.map(a => [a.id, a.name]));
  const activeMissions = missions.filter(m => m.status === 'running' || m.status === 'pending');

  return (
    <AppShell>
      <PageHeader
        title="Agency Map"
        subtitle="Hierarquia de agentes e estado em tempo real"
        actions={
          <a href="/agents" className="btn-primary text-sm py-2 px-4">
            <Plus size={15} />
            Deploy Node
          </a>
        }
      />

      {/* 3-column layout */}
      <div className="flex-1 p-6 grid grid-cols-1 xl:grid-cols-[1fr_1.2fr_280px] gap-6">

        {/* ── Col 1: Agency Map ─────────────────────── */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-space font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Agency Map
              </h2>
              <a href="/agents" className="btn-ghost text-xs py-1 px-3" style={{ minHeight: 'auto' }}>
                <Filter size={12} /> Filtrar
              </a>
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
              </div>
            ) : (
              <AgencyMap agents={agents} />
            )}
          </GlassCard>

          {/* RAG Status */}
          <GlassCard className="p-5" glow="amber">
            <div className="flex items-center gap-2 mb-3">
              <Database size={15} style={{ color: 'var(--secondary)' }} />
              <h3 className="font-space font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                RAG Status
              </h3>
              <span className="ml-auto text-xs font-space font-bold" style={{ color: 'var(--secondary)' }}>
                {ragStatus.coverage}% indexado
              </span>
            </div>
            <div className="progress-bar" style={{ background: 'rgba(255,191,0,0.1)' }}>
              <div className="progress-fill" style={{
                width: `${ragStatus.coverage}%`,
                background: 'linear-gradient(90deg, var(--secondary), #f59e0b)',
              }} />
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Último: <span style={{ color: 'var(--text-secondary)' }}>{ragStatus.lastFile}</span>
            </p>
          </GlassCard>
        </div>

        {/* ── Col 2: Missões Ativas ─────────────────── */}
        <div className="flex flex-col gap-6">
          <GlassCard className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <Activity size={15} style={{ color: 'var(--primary)' }} />
                <h2 className="font-space font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Missões Ativas
                </h2>
                {activeMissions.length > 0 && (
                  <span className="badge badge-running" style={{ fontSize: '0.625rem' }}>
                    {activeMissions.length}
                  </span>
                )}
              </div>
              <a href="/missions" className="btn-ghost text-xs py-1 px-3" style={{ minHeight: 'auto' }}>
                Ver todas →
              </a>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {missions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Zap size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhuma missão ativa.</p>
                  <a href="/missions" className="btn-ghost text-xs py-1.5 px-4" style={{ minHeight: 'auto' }}>
                    + Nova Missão
                  </a>
                </div>
              ) : (
                missions.map(m => (
                  <MissionRow
                    key={m.id}
                    mission={m}
                    agentName={agentMap[m.agentId] ?? 'Agente desconhecido'}
                  />
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* ── Col 3: Context Feed + Memoria ─────────── */}
        <div className="flex flex-col gap-4">
          {/* Feed */}
          <GlassCard className="p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-space font-semibold text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Context Feed
              </h3>
              <button
                onClick={() => {}}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Atualizar feed"
              >
                <RefreshCw size={12} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            <ContextFeed lines={feedLines} />
          </GlassCard>

          {/* Memoria Ativa */}
          <GlassCard className="p-4">
            <h3 className="font-space font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Memória Ativa
            </h3>
            <div className="space-y-2">
              {vaultFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <span className="text-2xl opacity-40">📂</span>
                  <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                    Nenhum arquivo na vault.
                    <br /><a href="/settings" style={{ color: 'var(--primary)' }}>Configurar →</a>
                  </p>
                </div>
              ) : (
                vaultFiles.map((f, i) => (
                  <div
                    key={f.path || i}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ border: '1px solid var(--border-subtle)' }}
                  >
                    <span className="text-base">📄</span>
                    <div className="min-w-0">
                      <p className="text-xs font-space font-medium text-white truncate">{f.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {f.size ? `${(f.size / 1024).toFixed(1)} KB` : '—'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </AppShell>
  );
}
