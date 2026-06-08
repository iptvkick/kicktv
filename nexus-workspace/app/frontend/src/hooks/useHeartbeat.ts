import { useState, useEffect } from 'react';
import api from './useApi';

interface HeartbeatState {
  status: 'online' | 'offline' | 'slow';
  latencyMs: number | null;
  engine: string;
  agentCount: number;
}

export default function useHeartbeat(intervalMs = 5000): HeartbeatState {
  const [state, setState] = useState<HeartbeatState>({
    status: 'offline',
    latencyMs: null,
    engine: 'gemini-cli',
    agentCount: 0,
  });

  useEffect(() => {
    let mounted = true;

    const ping = async () => {
      const start = Date.now();
      try {
        const r = await api.get('/api/health');
        const latency = Date.now() - start;
        if (!mounted) return;
        setState({
          status: latency > 2000 ? 'slow' : 'online',
          latencyMs: latency,
          engine: r.data?.engine ?? 'gemini-cli',
          agentCount: r.data?.agentCount ?? 0,
        });
      } catch {
        if (!mounted) return;
        setState(prev => ({ ...prev, status: 'offline', latencyMs: null }));
      }
    };

    ping();
    const interval = setInterval(ping, intervalMs);
    return () => { mounted = false; clearInterval(interval); };
  }, [intervalMs]);

  return state;
}
