import { Plus, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export default function ChatSessionList({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewSession 
}: {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}) {
  return (
    <div className="w-64 flex-shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--border)', background: 'rgba(9,9,11,0.3)' }}>
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <button 
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-space text-sm font-semibold transition-all"
          style={{ background: 'var(--primary)', color: 'black' }}
        >
          <Plus size={16} />
          Novo Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map((session, i) => {
          const isActive = session.id === activeSessionId;
          return (
            <motion.button
              key={session.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectSession(session.id)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors group relative overflow-hidden"
              style={{
                background: isActive ? 'rgba(0, 245, 230, 0.1)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
              }}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: 'var(--primary)' }}
                />
              )}
              <MessageSquare size={16} className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate font-medium">{session.title || 'Nova Conversa'}</p>
                <p className="text-[10px] opacity-50 truncate mt-0.5">
                  {new Date(session.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </motion.button>
          );
        })}
        {sessions.length === 0 && (
          <div className="p-4 text-center text-sm opacity-50 mt-4 font-space">
            Nenhuma conversa ainda
          </div>
        )}
      </div>
    </div>
  );
}
