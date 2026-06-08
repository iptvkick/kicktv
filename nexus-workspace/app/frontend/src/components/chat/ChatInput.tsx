import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSend, disabled }: {
  onSend: (message: string) => void;
  disabled: boolean;
}) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="px-6 py-4"
      style={{ borderTop: '1px solid var(--border)', background: 'rgba(9,9,11,0.6)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Envie uma mensagem... (Shift+Enter para nova linha)"
            disabled={disabled}
            rows={1}
            className="input-glass resize-none pr-12"
            style={{
              minHeight: '48px',
              maxHeight: '160px',
              paddingRight: '3.5rem',
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="btn-primary p-3 flex-shrink-0"
          style={{ minHeight: '48px', minWidth: '48px', padding: '0.75rem' }}
          aria-label="Enviar mensagem"
        >
          {disabled ? (
            <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
