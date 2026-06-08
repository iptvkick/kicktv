import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Plus, Trash2, User } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import ChatThread from '../components/chat/ChatThread';
import ChatInput from '../components/chat/ChatInput';
import api from '../hooks/useApi';

interface Agent {
  id: string;
  name: string;
  role: 'manager' | 'worker';
  description?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

const ROLE_COLORS = {
  manager: { border: 'rgba(0,245,230,0.3)', glow: 'rgba(0,245,230,0.08)', dot: '#00F5E6' },
  worker:  { border: 'rgba(255,191,0,0.25)', glow: 'rgba(255,191,0,0.06)', dot: '#FFBF00' },
};

export default function Chats() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);

  // Load agents list on mount
  useEffect(() => {
    api.get('/api/agents')
      .then(r => setAgents(r.data ?? []))
      .catch(() => setAgents([]))
      .finally(() => setLoadingAgents(false));
  }, []);

  // Load most recent chat session when agent selection changes
  useEffect(() => {
    if (!selectedAgent) return;
    setLoadingChat(true);
    setMessages([]);
    setActiveSessionId(null);
    api.get(`/api/agents/${selectedAgent.id}/chat`)
      .then(r => {
        const sessions: any[] = r.data ?? [];
        if (sessions.length > 0) {
          setActiveSessionId(sessions[0].id);
          setMessages(sessions[0].messages ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingChat(false));
  }, [selectedAgent]);

  // Poll for agent response while streaming
  useEffect(() => {
    if (!streaming || !activeSessionId || !selectedAgent) return;
    const interval = setInterval(() => {
      api.get(`/api/agents/${selectedAgent.id}/chat/${activeSessionId}/messages`)
        .then(r => {
          const msgs: Message[] = r.data ?? [];
          setMessages(msgs);
          if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
            setStreaming(false);
          }
        })
        .catch(() => {});
    }, 1500);
    return () => clearInterval(interval);
  }, [streaming, activeSessionId, selectedAgent]);

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
  }, []);

  const handleClearHistory = useCallback(() => {
    if (!selectedAgent || !confirm('Limpar todo o histórico de chat com este agente?')) return;
    setActiveSessionId(null);
    setMessages([]);
  }, [selectedAgent]);

  const handleSend = useCallback(async (message: string) => {
    if (!selectedAgent) return;
    setStreaming(true);

    // Optimistic user message bubble
    setMessages(prev => [...prev, {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    }]);

    try {
      const r = await api.post(`/api/agents/${selectedAgent.id}/chat`, {
        message,
        sessionId: activeSessionId,
      });

      const newSessionId = r.data?.sessionId;
      if (newSessionId && newSessionId !== activeSessionId) {
        setActiveSessionId(newSessionId);
      }

      // If backend returned response synchronously (rare but possible)
      if (r.data?.response) {
        setMessages(prev => [...prev, {
          id: r.data.messageId ?? `resp-${Date.now()}`,
          role: 'assistant',
          content: r.data.response,
          createdAt: new Date().toISOString(),
        }]);
        setStreaming(false);
      }
      // Otherwise polling in the useEffect above will catch the response
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Erro ao processar mensagem. Verifique se o motor está configurado.',
        createdAt: new Date().toISOString(),
      }]);
      setStreaming(false);
    }
  }, [selectedAgent, activeSessionId]);

  return (
    <AppShell>
      <div className="flex h-screen overflow-hidden">

        {/* ── LEFT: Agent List ── */}
        <aside
          className="flex flex-col flex-shrink-0 overflow-y-auto"
          style={{
            width: 260,
            borderRight: '1px solid var(--border)',
            background: 'rgba(9,9,11,0.7)',
          }}
        >
          <div
            className="px-4 py-4 flex items-center justify-between flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-sm font-space font-bold text-white">Agentes</span>
            <MessageSquare size={15} style={{ color: 'var(--primary)' }} />
          </div>

          {loadingAgents ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 rounded-full animate-spin"
                style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
            </div>
          ) : agents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 text-center">
              <User size={24} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Nenhum agente criado.<br />Crie um em Agentes.
              </p>
            </div>
          ) : (
            <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
              {agents.map(agent => {
                const colors = ROLE_COLORS[agent.role];
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                    style={{
                      background: isSelected ? colors.glow : 'transparent',
                      border: `1px solid ${isSelected ? colors.border : 'transparent'}`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: colors.glow, border: `1px solid ${colors.border}` }}
                    >
                      🤖
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-space font-semibold truncate"
                        style={{ color: isSelected ? '#fff' : 'var(--text-muted)' }}
                      >
                        {agent.name}
                      </p>
                      <p className="text-xs capitalize" style={{ color: colors.dot, fontSize: '0.65rem' }}>
                        {agent.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          )}
        </aside>

        {/* ── RIGHT: Chat area ── */}
        {!selectedAgent ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4"
            style={{ color: 'var(--text-muted)' }}
          >
            <MessageSquare size={40} style={{ opacity: 0.15 }} />
            <p className="text-sm font-space">Selecione um agente para conversar</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-w-0">

            {/* Header */}
            <div
              className="flex items-center gap-3 px-6 py-3 flex-shrink-0"
              style={{
                borderBottom: '1px solid var(--border)',
                background: 'rgba(9,9,11,0.7)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{
                  background: ROLE_COLORS[selectedAgent.role].glow,
                  border: `1px solid ${ROLE_COLORS[selectedAgent.role].border}`,
                }}
              >
                🤖
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-space font-bold text-white text-sm leading-tight truncate">
                  {selectedAgent.name}
                </h2>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {selectedAgent.description ?? selectedAgent.role}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                <button
                  onClick={handleNewChat}
                  className="btn-ghost text-xs py-1.5 px-3 gap-1.5"
                  style={{ color: 'var(--primary)' }}
                >
                  <Plus size={13} /> Novo Chat
                </button>
                <button
                  onClick={handleClearHistory}
                  className="btn-ghost text-xs py-1.5 px-3 gap-1.5"
                  style={{ color: '#f87171' }}
                >
                  <Trash2 size={13} /> Limpar
                </button>
              </div>
            </div>

            {/* Thread + Input */}
            {loadingChat ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-6 h-6 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
              </div>
            ) : (
              <>
                <ChatThread messages={messages} agentName={selectedAgent.name} streaming={streaming} />
                <ChatInput onSend={handleSend} disabled={streaming} />
              </>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
