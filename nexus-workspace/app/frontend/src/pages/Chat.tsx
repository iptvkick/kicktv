import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import ChatThread from '../components/chat/ChatThread';
import ChatInput from '../components/chat/ChatInput';
import ChatSessionList from '../components/chat/ChatSessionList';
import type { ChatSession as IChatSession } from '../components/chat/ChatSessionList';
import api from '../hooks/useApi';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

interface ChatSession extends IChatSession {
  messages: Message[];
}

interface Agent {
  id: string;
  name: string;
  role: string;
  description?: string;
}

export default function Chat() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load agent info
  useEffect(() => {
    if (!agentId) return;
    api.get(`/api/agents`).then(r => {
      const found = (r.data ?? []).find((a: Agent) => a.id === agentId);
      setAgent(found ?? null);
    }).catch(() => {});
  }, [agentId]);

  // Load chat history (sessions)
  useEffect(() => {
    if (!agentId) return;
    setLoading(true);
    api.get(`/api/agents/${agentId}/chat`).then(r => {
      const loadedSessions = r.data ?? [];
      setSessions(loadedSessions);
      if (loadedSessions.length > 0) {
        setActiveSessionId(loadedSessions[0].id);
        setMessages(loadedSessions[0].messages ?? []);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [agentId]);

  // When changing active session, load its messages
  useEffect(() => {
    if (activeSessionId) {
      const session = sessions.find(s => s.id === activeSessionId);
      if (session) {
        setMessages(session.messages ?? []);
      }
    } else {
      setMessages([]);
    }
  }, [activeSessionId, sessions]);

  // Poll for new messages when streaming
  useEffect(() => {
    if (!streaming || !activeSessionId || !agentId) return;
    const interval = setInterval(() => {
      api.get(`/api/agents/${agentId}/chat/${activeSessionId}/messages`).then(r => {
        const msgs = r.data ?? [];
        setMessages(msgs);
        
        // Update the session's messages in the sidebar memory too
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: msgs } : s));

        // Check if last message is from assistant (response arrived)
        if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
          setStreaming(false);
        }
      }).catch(() => {});
    }, 1500); // Polling otimizado: 1.5s instead of 2.0s
    return () => clearInterval(interval);
  }, [streaming, activeSessionId, agentId]);

  const handleNewSession = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
  }, []);

  const handleSend = useCallback(async (message: string) => {
    if (!agentId) return;
    setStreaming(true);

    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const r = await api.post(`/api/agents/${agentId}/chat`, { message, sessionId: activeSessionId });
      
      let newSessionId = r.data?.sessionId;
      
      if (newSessionId && newSessionId !== activeSessionId) {
        setActiveSessionId(newSessionId);
        // Refresh sessions list if it's a new session
        api.get(`/api/agents/${agentId}/chat`).then(r => {
          setSessions(r.data ?? []);
        });
      }

      if (r.data?.response) {
        const assistantMsg: Message = {
          id: r.data.messageId ?? `resp-${Date.now()}`,
          role: 'assistant',
          content: r.data.response,
          createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMsg]);
        setStreaming(false);
      }
    } catch (_) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Erro ao processar mensagem. Verifique se o motor está configurado corretamente.',
        createdAt: new Date().toISOString(),
      }]);
      setStreaming(false);
    }
  }, [agentId, activeSessionId]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
        </div>
      </AppShell>
    );
  }

  if (!agent) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-lg font-space" style={{ color: 'var(--text-muted)' }}>Agente não encontrado</p>
          <button onClick={() => navigate('/agents')} className="btn-ghost text-sm">
            <ArrowLeft size={15} /> Voltar aos Agentes
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex h-full overflow-hidden">
        {/* Sidebar: Session List */}
        <ChatSessionList 
          sessions={sessions} 
          activeSessionId={activeSessionId} 
          onSelectSession={setActiveSessionId}
          onNewSession={handleNewSession}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div
            className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border)', background: 'rgba(9,9,11,0.6)', backdropFilter: 'blur(12px)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background: agent.role === 'manager' ? 'rgba(0,245,230,0.1)' : 'rgba(255,191,0,0.08)',
                border: `1px solid ${agent.role === 'manager' ? 'rgba(0,245,230,0.25)' : 'rgba(255,191,0,0.2)'}`,
              }}
            >
              🤖
            </div>
            <div className="min-w-0">
              <h2 className="font-space font-bold text-white truncate">{agent.name}</h2>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {agent.description ?? `${agent.role} agent`}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 flex-shrink-0">
              <div className="dot-pulse teal" />
              <span className="text-xs font-space" style={{ color: 'var(--text-muted)' }}>Online</span>
            </div>
          </div>

          {/* Chat Thread */}
          <ChatThread messages={messages} agentName={agent.name} streaming={streaming} />

          {/* Chat Input */}
          <ChatInput onSend={handleSend} disabled={streaming} />
        </div>
      </div>
    </AppShell>
  );
}
