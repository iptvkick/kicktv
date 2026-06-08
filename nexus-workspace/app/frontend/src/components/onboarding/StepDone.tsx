import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, LayoutDashboard, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';

interface StepDoneProps {
  agencyName: string;
  engine: string;
  vaultPath: string | null;
}

const ENGINE_LABELS: Record<string, string> = {
  'gemini-cli': 'Gemini CLI',
  'openclaw':   'OpenClaw',
  'hermes':     'Hermes',
};

export default function StepDone({ agencyName, engine, vaultPath }: StepDoneProps) {
  const navigate = useNavigate();

  useEffect(() => {
    api.post('/api/config/set', { key: 'onboarded', value: 'true' }).catch(() => {});
  }, []);

  const summary = [
    { label: 'Agência', value: agencyName },
    { label: 'Motor',   value: ENGINE_LABELS[engine] ?? engine },
    { label: 'Vault',   value: vaultPath ?? 'Não configurada' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center text-center gap-8 max-w-lg mx-auto"
    >
      {/* Celebration icon */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-24 h-24 rounded-3xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(0,245,230,0.2), rgba(0,180,216,0.1))',
          border: '1px solid rgba(0,245,230,0.35)',
          boxShadow: '0 0 60px rgba(0,245,230,0.2)',
        }}
      >
        <CheckCircle2 size={44} style={{ color: 'var(--primary)' }} />
      </motion.div>

      {/* Text */}
      <div className="space-y-3">
        <h2 className="font-space font-bold text-4xl text-white">
          Agência <span style={{ color: 'var(--primary)' }}>Pronta!</span> 🚀
        </h2>
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          Sua infraestrutura autônoma foi configurada com sucesso. Bem-vindo ao futuro do trabalho.
        </p>
      </div>

      {/* Summary */}
      <div className="w-full glass-panel rounded-2xl overflow-hidden">
        {summary.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-6 py-3.5"
            style={{
              borderBottom: i < summary.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <span className="text-sm font-space font-medium" style={{ color: 'var(--text-muted)' }}>
              {item.label}
            </span>
            <span className="text-sm font-space font-semibold" style={{ color: 'var(--text-primary)' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/dashboard')}
        className="btn-primary w-full text-base animate-cta-pulse"
      >
        <LayoutDashboard size={18} />
        Abrir Dashboard
      </motion.button>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        <Sparkles size={12} className="inline mr-1" />
        Você pode reconfigurar qualquer coisa em Configurações a qualquer momento.
      </p>
    </motion.div>
  );
}
