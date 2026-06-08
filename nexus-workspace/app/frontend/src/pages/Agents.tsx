import { useState, useEffect, useCallback } from 'react';
import { Plus, MessageSquare, Trash2, User } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/ui/Modal';
import AgentFlowCanvas from '../components/agents/AgentFlowCanvas';
import api from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

interface Agent {
  id: string;
  name: string;
  role: 'manager' | 'worker';
  description?: string;
  systemPrompt?: string;
}

interface AgentFormData {
  name: string;
  role: Agent['role'];
  description: string;
  systemPrompt: string;
}

const ROLE_COLORS = {
  manager: { bg: 'rgba(0,245,230,0.08)', border: 'rgba(0,245,230,0.25)', text: 'var(--primary)' },
  worker:  { bg: 'rgba(255,191,0,0.06)', border: 'rgba(255,191,0,0.2)',  text: 'var(--secondary)' },
};


/* ─── Extracted stable component (fixes BUG-01: input losing focus) ─── */
function AgentForm({ form, onChange }: { form: AgentFormData; onChange: (f: AgentFormData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Nome do Agente</label>
        <input
          type="text"
          value={form.name}
          onChange={e => onChange({ ...form, name: e.target.value })}
          placeholder="Nome do agente"
          className="input-glass"
        />
      </div>
      <div>
        <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Role</label>
        <div className="flex gap-3">
          {(['manager', 'worker'] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => onChange({ ...form, role: r })}
              className="flex-1 py-2.5 rounded-xl text-sm font-space font-semibold capitalize transition-all duration-200"
              style={form.role === r ? {
                background: ROLE_COLORS[r].bg,
                border: `1px solid ${ROLE_COLORS[r].border}`,
                color: ROLE_COLORS[r].text,
              } : {
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Descrição</label>
        <input
          type="text"
          value={form.description}
          onChange={e => onChange({ ...form, description: e.target.value })}
          placeholder="Especialidade ou função do agente"
          className="input-glass"
        />
      </div>
      <div>
        <label className="block text-xs font-space font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
          System Prompt (SOUL)
        </label>
        <textarea
          value={form.systemPrompt}
          onChange={e => onChange({ ...form, systemPrompt: e.target.value })}
          placeholder="Você é um agente especializado em..."
          rows={6}
          className="input-glass font-mono text-sm resize-none"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8125rem', lineHeight: 1.6 }}
        />
      </div>
    </div>
  );
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState<Agent | null>(null);
  const [form, setForm] = useState<AgentFormData>({ name: '', role: 'worker', description: '', systemPrompt: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    api.get('/api/agents')
      .then(r => setAgents(r.data ?? []))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ name: '', role: 'worker', description: '', systemPrompt: '' });
    setNewModal(true);
  };

  const openEdit = (a: Agent) => {
    setForm({ name: a.name, role: a.role, description: a.description ?? '', systemPrompt: a.systemPrompt ?? '' });
    setEditModal(a);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await api.post('/api/agents', form);
      setNewModal(false);
      load();
    } catch (_) {}
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!editModal || !form.name.trim()) return;
    setSaving(true);
    try {
      await api.put(`/api/agents/${editModal.id}`, form);
      setEditModal(null);
      load();
    } catch (_) {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este agente?')) return;
    await api.delete(`/api/agents/${id}`).catch(() => {});
    if (editModal?.id === id) setEditModal(null);
    load();
  };

  const handleUpdatePosition = useCallback(async (id: string, x: number, y: number) => {
    await api.put(`/api/agents/${id}`, { positionX: x, positionY: y }).catch(() => {});
  }, []);

  const handleConnect = useCallback(async (sourceId: string, targetId: string) => {
    // Save the connection in the DB - canvas handles edges optimistically
    await api.put(`/api/agents/${targetId}`, { parentId: sourceId }).catch(() => {});
    // NOTE: No load() here intentionally - calling load() would reset AgentFlowCanvas positions
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Agentes"
        subtitle="Gerencie a hierarquia e os SOULs da sua agência"
        actions={
          <button onClick={openNew} className="btn-primary text-sm py-2 px-4">
            <Plus size={15} /> Novo Agente
          </button>
        }
      />

      <div className="flex-1 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
          </div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <User size={28} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Nenhum agente criado ainda.</p>
            <button onClick={openNew} className="btn-primary text-sm py-2 px-5">
              <Plus size={15} /> Criar primeiro agente
            </button>
          </div>
        ) : (
          <AgentFlowCanvas 
            agents={agents} 
            onUpdatePosition={handleUpdatePosition}
            onConnect={handleConnect}
            onNodeClick={(id) => {
              const a = agents.find(ag => ag.id === id);
              if (a) openEdit(a);
            }}
            onNodeDoubleClick={(id) => navigate(`/chat/${id}`)}
          />
        )}
      </div>

      {/* New Agent Modal */}
      <Modal open={newModal} onClose={() => setNewModal(false)} title="Novo Agente">
        <AgentForm form={form} onChange={setForm} />
        <div className="flex gap-3 mt-6">
          <button onClick={() => setNewModal(false)} className="btn-ghost flex-1 justify-center">Cancelar</button>
          <button onClick={handleCreate} disabled={!form.name.trim() || saving} className="btn-primary flex-1 justify-center">
            {saving ? <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" /> : 'Criar Agente'}
          </button>
        </div>
      </Modal>

      {/* Edit Agent Modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Editar SOUL">
        <AgentForm form={form} onChange={setForm} />
        <div className="flex flex-col gap-3 mt-6">
          <div className="flex gap-3">
            <button onClick={() => setEditModal(null)} className="btn-ghost flex-1 justify-center">Cancelar</button>
            <button onClick={handleUpdate} disabled={!form.name.trim() || saving} className="btn-primary flex-1 justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" /> : 'Salvar SOUL'}
            </button>
          </div>
          {editModal && (
            <div className="flex gap-3 pt-3 mt-1 border-t border-white/5">
              <button 
                onClick={() => {
                  navigate(`/chat/${editModal.id}`);
                }} 
                className="btn-ghost flex-1 text-sm font-space justify-center"
                style={{ color: 'var(--primary)' }}
              >
                <MessageSquare size={14} /> Conversar
              </button>
              <button
                onClick={() => handleDelete(editModal.id)}
                className="btn-danger flex-1 text-sm font-space justify-center"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          )}
        </div>
      </Modal>
    </AppShell>
  );
}
