import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Code2, CheckCircle2, ArrowRight, Download, Check } from 'lucide-react';
import TerminalBlock from '../ui/TerminalBlock';
import { useProcessSession } from '../../hooks/useProcessSession';
import api from '../../hooks/useApi';

type Engine = 'gemini-cli' | 'openclaw' | 'hermes';

interface EngineConfig {
  id: Engine;
  icon: typeof Terminal;
  title: string;
  tagline: string;
  pkg?: string; // npm package to install
  cmd?: string; // command to verify
  hasOAuth?: boolean;
}

const ENGINES: EngineConfig[] = [
  {
    id: 'gemini-cli',
    icon: Terminal,
    title: 'Gemini CLI',
    tagline: 'Core AI Agent oficial do Google.',
    pkg: '@google/gemini-cli',
    cmd: 'gemini',
    hasOAuth: true,
  },
  {
    id: 'openclaw',
    icon: Cpu,
    title: 'OpenClaw',
    tagline: 'Orquestração de múltiplos agentes.',
    pkg: 'openclaw',
    cmd: 'openclaw',
    hasOAuth: false,
  },
  {
    id: 'hermes',
    icon: Code2,
    title: 'Hermes',
    tagline: 'Framework experimental Go (REST API).',
    hasOAuth: false,
  },
];

interface StepEngineProps {
  onNext: (data: { engine: Engine }) => void;
}

export default function StepEngine({ onNext }: StepEngineProps) {
  const [selected, setSelected] = useState<Engine>('gemini-cli');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'verifying' | 'installed'>('idle');
  
  const engine = ENGINES.find(e => e.id === selected)!;

  const handleProcessExit = async (code: number) => {
    if (loading) {
      if (code === 0) {
        try {
          await api.post('/api/config/set', { key: 'engine', value: selected });
          appendLine({ type: 'success', text: `✓ Motor "${engine.title}" configurado e definido como padrão.` });
          setSuccess(true);
        } catch (err: any) {
          appendLine({ type: 'error', text: `✗ Erro ao salvar configuração: ${err.message}` });
        }
      }
      setLoading(false);
    }
  };

  const { lines, isRunning, spawnProcess, writeInput, clearTerminal, appendLine } = useProcessSession({ onExit: handleProcessExit });


  const resetState = (newEngine: Engine) => {
    setSelected(newEngine);
    setSuccess(false);
    setInstallStatus('idle');
    clearTerminal();
    appendLine({ type: 'muted', text: `# Motor selecionado: ${ENGINES.find(e => e.id === newEngine)?.title}` });
  };

  const handleInstall = async () => {
    if (!engine.pkg) return;
    setInstallStatus('installing');
    await spawnProcess('npm', ['install', '-g', engine.pkg]);
    setInstallStatus('installed');
  };

  const handleVerify = async () => {
    if (!engine.cmd) return;
    setInstallStatus('verifying');
    await spawnProcess(engine.cmd, ['--version']);
    setInstallStatus('installed');
  };

  const handleAuth = async () => {
    setLoading(true);
    appendLine({ type: 'info', text: `› Iniciando setup interativo para ${selected}...` });

    try {
      if (selected === 'gemini-cli') {
        await spawnProcess('gemini', ['auth']);
      } else if (selected === 'hermes') {
        await spawnProcess('wsl', ['hermes', 'setup']);
      } else if (selected === 'openclaw') {
        await spawnProcess('openclaw', ['init']);
      }
    } catch (err: any) {
      appendLine({ type: 'error', text: `✗ Erro: ${err.message}` });
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h2 className="font-space font-bold text-4xl text-white">Conexão <span style={{ color: 'var(--primary)' }}>Agnóstica</span></h2>
        <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
          Instale pacotes, verifique o ambiente e autentique seu motor.
        </p>
      </div>

      {/* Engine Cards */}
      <div className="grid grid-cols-3 gap-4">
        {ENGINES.map(eng => {
          const Icon = eng.icon;
          const isActive = selected === eng.id;
          return (
            <motion.button
              key={eng.id}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => resetState(eng.id)}
              className="glass-panel p-5 rounded-2xl flex flex-col items-start gap-3 text-left relative overflow-hidden transition-all duration-300"
              style={isActive ? {
                borderColor: 'rgba(0,245,230,0.4)',
                boxShadow: '0 0 24px rgba(0,245,230,0.12)',
                background: 'rgba(0,245,230,0.05)',
              } : { borderColor: 'var(--border)' }}
            >
              {isActive && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(0,245,230,0.06), transparent)' }} />
              )}
              <div className="p-2.5 rounded-xl" style={{
                background: isActive ? 'rgba(0,245,230,0.15)' : 'rgba(255,255,255,0.05)',
              }}>
                <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
              </div>
              <div>
                <h3 className="font-space font-semibold text-sm" style={{ color: isActive ? 'white' : 'var(--text-secondary)' }}>
                  {eng.title}
                </h3>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {eng.tagline}
                </p>
              </div>
              {isActive && (
                <CheckCircle2 size={16} className="absolute top-3 right-3" style={{ color: 'var(--primary)' }} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Interactive Panel */}
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass-panel rounded-2xl p-6 space-y-6"
          >
            {/* Action Bar (Install / Verify) */}
            {engine.pkg && (
              <div className="flex gap-3">
                <button
                  onClick={handleInstall}
                  disabled={isRunning || loading}
                  className="btn-ghost flex-1 text-sm bg-white/5 hover:bg-white/10"
                >
                  <Download size={14} />
                  Instalar CLI ({engine.pkg})
                </button>
                <button
                  onClick={handleVerify}
                  disabled={isRunning || loading}
                  className="btn-ghost flex-1 text-sm bg-white/5 hover:bg-white/10"
                >
                  <Check size={14} />
                  Verificar Instalação
                </button>
              </div>
            )}



            {/* Terminal Live Output */}
            <TerminalBlock lines={lines} title="System Output" showCursor={isRunning || loading} onInput={isRunning ? writeInput : undefined} />

            <div className="flex gap-3">
              <button
                onClick={() => setSuccess(true)}
                className="btn-ghost flex-1"
                style={{ borderColor: 'rgba(0,245,230,0.3)', color: 'var(--primary)' }}
              >
                Forçar Sucesso (Debug)
              </button>
              
              <button
                onClick={handleAuth}
                disabled={isRunning || loading}
                className="btn-primary flex-2"
              >
                {loading && installStatus === 'idle' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    Salvando Config...
                  </>
                ) : (
                  <>Iniciar Setup / Autenticar</>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-2xl p-6 flex items-center gap-4"
            style={{ borderColor: 'rgba(0,245,230,0.3)', background: 'rgba(0,245,230,0.04)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,245,230,0.12)', border: '1px solid rgba(0,245,230,0.25)' }}>
              <CheckCircle2 size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h3 className="font-space font-bold text-white">{engine.title} Operacional!</h3>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Motor autenticado e configurado.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {success && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onNext({ engine: selected })}
          className="btn-primary w-full"
        >
          Avançar: Conectar Vault
          <ArrowRight size={18} />
        </motion.button>
      )}
    </motion.div>
  );
}
