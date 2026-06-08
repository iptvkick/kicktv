import { useState, useCallback, useRef } from 'react';
import api from './useApi';
import type { TerminalLine } from '../components/ui/TerminalBlock';

interface UseProcessSessionResult {
  lines: TerminalLine[];
  sessionId: string | null;
  isRunning: boolean;
  spawnProcess: (command: string, args?: string[]) => Promise<void>;
  writeInput: (input: string) => Promise<void>;
  killProcess: () => Promise<void>;
  clearTerminal: () => void;
  appendLine: (line: TerminalLine) => void;
}

interface UseProcessSessionOptions {
  onExit?: (code: number) => void;
}

export function useProcessSession(options: UseProcessSessionOptions = {}): UseProcessSessionResult {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const appendLine = useCallback((line: TerminalLine) => {
    setLines(prev => [...prev, line]);
  }, []);

  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setSessionId(null);
    setIsRunning(false);
  }, []);

  const spawnProcess = useCallback(async (command: string, args: string[] = []) => {
    try {
      setIsRunning(true);
      // Create session
      const { data } = await api.post('/api/setup/spawn', { command, args });
      const newSessionId = data.sessionId;
      setSessionId(newSessionId);

      appendLine({ type: 'prompt', text: `$ ${command} ${args.join(' ')}` });

      // Connect to SSE stream
      const streamUrl = `http://localhost:3000/api/setup/stream/${newSessionId}`;
      const es = new EventSource(streamUrl);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          
          if (payload.type === 'stdout') {
            payload.text.split('\n').forEach((t: string) => {
              if (t.trim()) appendLine({ type: 'info', text: t });
            });
          } else if (payload.type === 'stderr') {
            payload.text.split('\n').forEach((t: string) => {
              if (t.trim()) appendLine({ type: 'muted', text: t });
            });
          } else if (payload.type === 'close') {
            appendLine({ type: payload.code === 0 ? 'success' : 'error', text: `[Process exited with code ${payload.code}]` });
            cleanup();
            if (options.onExit) options.onExit(payload.code);
          } else if (payload.type === 'error') {
            appendLine({ type: 'error', text: `[Stream Error: ${payload.text}]` });
            cleanup();
          }
        } catch (err) {
          console.error('Error parsing SSE message', err);
        }
      };

      es.onerror = () => {
        appendLine({ type: 'error', text: '[Connection lost]' });
        cleanup();
      };

    } catch (err: any) {
      appendLine({ type: 'error', text: `Failed to spawn: ${err.response?.data?.error || err.message}` });
      setIsRunning(false);
    }
  }, [appendLine, cleanup]);

  const writeInput = useCallback(async (input: string) => {
    if (!sessionId) return;
    try {
      appendLine({ type: 'info', text: input }); // Echo user input
      await api.post('/api/setup/input', { sessionId, input });
    } catch (err: any) {
      appendLine({ type: 'error', text: `Input failed: ${err.message}` });
    }
  }, [sessionId, appendLine]);

  const killProcess = useCallback(async () => {
    if (!sessionId) return;
    try {
      await api.post(`/api/setup/kill/${sessionId}`);
      cleanup();
    } catch (err: any) {
      appendLine({ type: 'error', text: `Kill failed: ${err.message}` });
    }
  }, [sessionId, cleanup, appendLine]);

  return {
    lines,
    sessionId,
    isRunning,
    spawnProcess,
    writeInput,
    killProcess,
    clearTerminal,
    appendLine,
  };
}
