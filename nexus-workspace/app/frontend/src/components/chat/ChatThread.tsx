import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

function formatTime(ts: string) {
  try {
    return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '';
  }
}

export default function ChatThread({ messages, agentName, streaming }: {
  messages: Message[];
  agentName: string;
  streaming: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 && !streaming && (
        <div className="flex flex-col items-center justify-center h-full gap-3 opacity-60">
          <span className="text-4xl">💬</span>
          <p className="text-sm font-space" style={{ color: 'var(--text-muted)' }}>
            Envie uma mensagem para iniciar a conversa com <span style={{ color: 'var(--primary)' }}>{agentName}</span>
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <motion.div
          key={msg.id || i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i === messages.length - 1 ? 0.1 : 0 }}
          className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
        >
          <div
            className="px-4 py-3 rounded-2xl"
            style={msg.role === 'user' ? {
              background: 'rgba(0,245,230,0.06)',
              borderLeft: '3px solid var(--primary)',
              borderRadius: '0 0.75rem 0.75rem 0',
            } : {
              background: 'rgba(255,191,0,0.04)',
              borderLeft: '3px solid var(--secondary)',
              borderRadius: '0 0.75rem 0.75rem 0',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-space font-semibold" style={{
                color: msg.role === 'user' ? 'var(--primary)' : 'var(--secondary)'
              }}>
                {msg.role === 'user' ? 'Você' : `🤖 ${agentName}`}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formatTime(msg.createdAt)}
              </span>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap markdown-body" style={{ color: 'var(--text-secondary)' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      ))}

      {streaming && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[85%] mr-auto"
        >
          <div
            className="px-4 py-3 rounded-2xl"
            style={{
              background: 'rgba(255,191,0,0.04)',
              borderLeft: '3px solid var(--secondary)',
              borderRadius: '0 0.75rem 0.75rem 0',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-space font-semibold" style={{ color: 'var(--secondary)' }}>
                🤖 {agentName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--secondary)' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <span className="text-sm ml-2 animate-blink" style={{ color: 'var(--secondary)' }}>▋</span>
            </div>
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
