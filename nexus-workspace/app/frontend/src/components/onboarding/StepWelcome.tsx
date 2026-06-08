import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Building2 } from 'lucide-react';
import api from '../../hooks/useApi';

interface StepWelcomeProps {
  onNext: (data: { agencyName: string }) => void;
}

export default function StepWelcome({ onNext }: StepWelcomeProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await api.post('/api/config/set', { key: 'agencyName', value: name.trim() });
    } catch (_) {}
    onNext({ agencyName: name.trim() });
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center text-center gap-10 max-w-xl mx-auto"
    >
      {/* Icon */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 rounded-3xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(0,245,230,0.15), rgba(0,180,216,0.08))',
          border: '1px solid rgba(0,245,230,0.25)',
          boxShadow: '0 0 40px rgba(0,245,230,0.15)',
        }}
      >
        <Sparkles size={40} style={{ color: 'var(--primary)' }} />
      </motion.div>

      {/* Text */}
      <div className="space-y-4">
        <h1 className="font-space font-bold text-5xl text-white leading-tight">
          Bem-vindo à<br />
          <span style={{
            background: 'linear-gradient(90deg, #00F5E6, #00b4d8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Nova Era
          </span>
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Configure sua agência autônoma com memória vetorial,
          motor de IA e hierarquia de agentes em poucos minutos.
        </p>
      </div>

      {/* Input */}
      <div className="w-full space-y-3">
        <label className="block text-sm font-space font-medium text-left" style={{ color: 'var(--text-secondary)' }}>
          <Building2 size={14} className="inline mr-2" />
          Nome da sua agência
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleNext()}
          placeholder="Ex: DaviCode Agency"
          className="input-glass text-center text-lg"
          autoFocus
        />
      </div>

      <button
        onClick={handleNext}
        disabled={!name.trim() || loading}
        className="btn-primary w-full text-base animate-cta-pulse"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            Salvando...
          </span>
        ) : (
          <>
            Começar Setup
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </motion.div>
  );
}
