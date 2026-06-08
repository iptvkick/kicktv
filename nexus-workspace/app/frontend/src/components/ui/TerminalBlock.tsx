import { useEffect, useRef, useState } from 'react';

export interface TerminalLine {
  type: 'success' | 'error' | 'info' | 'warn' | 'muted' | 'prompt';
  text: string;
}

interface TerminalBlockProps {
  lines: TerminalLine[];
  title?: string;
  maxHeight?: number;
  showCursor?: boolean;
  onInput?: (text: string) => void;
}

export default function TerminalBlock({
  lines,
  title = 'Terminal',
  maxHeight = 220,
  showCursor = false,
  onInput,
}: TerminalBlockProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines, inputValue]);

  const handleTerminalClick = () => {
    if (onInput && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onInput) {
      e.preventDefault();
      onInput(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="terminal-block" onClick={handleTerminalClick} style={{ cursor: onInput ? 'text' : 'default' }}>
      <div className="terminal-header">
        <span className="terminal-dot" style={{ background: '#ff5f56' }} />
        <span className="terminal-dot" style={{ background: '#ffbd2e' }} />
        <span className="terminal-dot" style={{ background: '#27c93f' }} />
        <span className="ml-3 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>
          {title}
        </span>
      </div>
      <div
        ref={bodyRef}
        className="terminal-body"
        style={{ maxHeight }}
      >
        {lines.map((line, i) => (
          <span
            key={i}
            className={`terminal-line ${line.type === 'prompt' ? 'terminal-prompt' : line.type}`}
          >
            {line.text}
            {'\n'}
          </span>
        ))}
        {onInput && (
          <div className="flex items-center">
            <span style={{ color: 'var(--primary)', marginRight: '8px' }}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none flex-1 font-mono text-sm text-zinc-300"
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
          </div>
        )}
        {showCursor && !onInput && (
          <span style={{ color: 'var(--primary)' }} className="animate-blink">▋</span>
        )}
      </div>
    </div>
  );
}
