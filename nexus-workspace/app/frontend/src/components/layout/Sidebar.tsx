import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, ListChecks, BookOpen,
  Settings, Sparkles, Cpu, Terminal, Code2, MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import useHeartbeat from '../../hooks/useHeartbeat';
import api from '../../hooks/useApi';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/agents',    icon: Users,           label: 'Agentes' },
  { to: '/chats',     icon: MessageSquare,   label: 'Chats' },
  { to: '/missions',  icon: ListChecks,      label: 'Missões' },
  { to: '/vault',     icon: BookOpen,        label: 'Vault' },
];

const ENGINE_ICONS: Record<string, typeof Cpu> = {
  'gemini-cli': Terminal,
  'openclaw':   Cpu,
  'hermes':     Code2,
};

const ENGINE_LABELS: Record<string, string> = {
  'gemini-cli': 'Gemini CLI',
  'openclaw':   'OpenClaw',
  'hermes':     'Hermes',
};

export default function Sidebar() {
  const [agencyName, setAgencyName] = useState<string>('Nexus Agency');
  const { status, latencyMs, engine } = useHeartbeat(5000);

  useEffect(() => {
    api.get('/api/config')
      .then(r => {
        if (r.data?.agencyName)  setAgencyName(r.data.agencyName);
      })
      .catch(() => {});
  }, []);

  const EngineIcon = ENGINE_ICONS[engine] ?? Terminal;

  const statusColor = status === 'online' ? '#4ade80'
    : status === 'slow' ? 'var(--secondary)'
    : '#f87171';

  const statusLabel = status === 'online' ? 'online'
    : status === 'slow' ? 'lento'
    : 'offline';

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40"
      style={{
        width: 'var(--sidebar-w)',
        background: 'rgba(9,9,11,0.92)',
        borderRight: '1px solid var(--border)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #00F5E6, #00b4d8)',
            boxShadow: '0 0 18px rgba(0,245,230,0.35)',
          }}
        >
          <Sparkles size={16} className="text-zinc-950" />
        </div>
        <div>
          <span className="font-space font-bold text-base text-white leading-tight">
            Nexus<span style={{ color: 'var(--primary)' }}>.Studio</span>
          </span>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>
            {agencyName}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Config + Motor status */}
      <div className="px-3 pb-4 space-y-1">
        <div className="divider mb-3" />

        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={17} />
          Configurações
        </NavLink>

        {/* Motor Status Card — Real heartbeat (BUG-02 fix) */}
        <div
          className="mt-3 mx-1 p-3 rounded-xl"
          style={{
            background: status === 'online' ? 'rgba(0,245,230,0.04)' : 'rgba(239,68,68,0.04)',
            border: `1px solid ${status === 'online' ? 'rgba(0,245,230,0.12)' : 'rgba(239,68,68,0.12)'}`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className={`dot-pulse ${status === 'online' ? 'teal' : status === 'slow' ? 'amber' : ''}`}
              style={status === 'offline' ? { background: '#f87171', width: 8, height: 8, borderRadius: '50%' } : {}}
            />
            <span className="text-xs font-space font-semibold" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Motor Status
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <EngineIcon size={14} style={{ color: statusColor }} />
            <span className="text-sm font-space font-semibold" style={{ color: statusColor }}>
              {ENGINE_LABELS[engine] ?? engine}{' '}
              <span style={{ color: statusColor, fontSize: '0.7rem' }}>
                ● {statusLabel}
                {latencyMs !== null && ` (${latencyMs}ms)`}
              </span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
