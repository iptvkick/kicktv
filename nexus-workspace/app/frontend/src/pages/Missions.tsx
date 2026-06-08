import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp, Send } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import api from '../hooks/useApi';

type MissionStatus = 'pending' | 'running' | 'done' | 'error';

interface Mission {
  id: string;
  title: string;
  agentId: string;
  status: MissionStatus;
  progress?: number;
  createdAt: string;
}

interface Agent { id: string; name: string; }

const STATUS_COLS: { key: MissionStatus; label: string }[] = [
  { key: 'pending', label: 'Pendente' },
  { key: 'running', label: 'Em Execução' },
  { key: 'done',    label: 'Concluída' },
  { key: 'error',   label: 'Falha' },
];

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [agents, setAgents]     = useState<Agent[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newModal, setNewModal]  = useState(false);
  const [form, setForm] = useState({ agentId: '', instruction: '' });
  const [sending, setSending]    = useState(false);

  const load = () => {
    api.get('/api/missions').then(r => setMissions(r.data ?? [])).catch(() => {});
    api.get('/api/agents').then(r => setAgents(r.data ?? [])).catch(() => {});
  };

  useEffect(() => { load(); const i = setInterval(load, 5000); return () => clearInterval(i); }, []);

  const agentMap = Object.fromEntries(agents.map(a => [a.id, a.name]));

  const handleSend = async () => {
    if (!form.agentId || !form.instruction.trim()) return;
    setSending(true);
    try {
      await api.post('/api/agents/chat', { agentId: form.agentId, message: form.instruction });
      setNewModal(false);
      setForm({ agentId: '', instruction: '' });
      load();
    } catch (_) {}
    setSending(false);
  };

  const byStatus = (status: MissionStatus) => missions.filter(m => m.status === status);

  return (
    <AppShell>
      <PageHeader
        title="Missões"
        subtitle="Tarefas delegadas aos agentes da agência"
        actions={
          <button onClick={() => setNewModal(true)} className="btn-primary text-sm py-2 px-4">
            <Plus size={15} /> Nova Missão
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Kanban Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUS_COLS.map(col => {
            const items = byStatus(col.key);
            return (
              <div key={col.key}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <h3 className="font-space font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {col.label}
                  </h3>
                  <span className="text-xs font-space px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="glass-panel rounded-xl p-4 flex items-center justify-center h-20" style={{ borderStyle: 'dashed' }}>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Vazio</p>
                    </div>
                  ) : (
                    items.map(m => (
                      <motion.div
                        key={m.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <GlassCard className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm font-space font-medium text-white leading-snug flex-1">
                              {m.title}
                            </p>
                            <Badge variant={m.status as any} dot={false} />
                          </div>
                          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                            {agentMap[m.agentId] ?? '—'}
                          </p>
                          {typeof m.progress === 'number' && (
                            <div className="progress-bar mb-3">
                              <div className="progress-fill" style={{ width: `${m.progress}%` }} />
                            </div>
                          )}
                          <button
                            onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                            className="flex items-center gap-1 text-xs"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {expandedId === m.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            {expandedId === m.id ? 'Ocultar' : 'Ver log'}
                          </button>
                          {expandedId === m.id && (
                            <div className="mt-2 p-2.5 rounded-lg font-mono text-xs" style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}>
                              Log da missão em breve...
                            </div>
                          )}
                        </GlassCard>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Mission Modal */}
      <Modal open={newModal} onClose={() => setNewModal(false)} title="Nova Missão">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Agente responsável
            </label>
            <select
              value={form.agentId}
              onChange={e => setForm(p => ({ ...p, agentId: e.target.value }))}
              className="input-glass"
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Selecione um agente...</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Instrução / Missão
            </label>
            <textarea
              value={form.instruction}
              onChange={e => setForm(p => ({ ...p, instruction: e.target.value }))}
              placeholder="Descreva o que o agente deve fazer..."
              rows={5}
              className="input-glass resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setNewModal(false)} className="btn-ghost flex-1 justify-center">Cancelar</button>
          <button
            onClick={handleSend}
            disabled={!form.agentId || !form.instruction.trim() || sending}
            className="btn-primary flex-1 justify-center"
          >
            {sending
              ? <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              : <><Send size={15} /> Delegar Missão</>
            }
          </button>
        </div>
      </Modal>
    </AppShell>
  );
}
