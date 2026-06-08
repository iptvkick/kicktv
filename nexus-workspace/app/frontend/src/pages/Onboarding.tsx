import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import StepWelcome from '../components/onboarding/StepWelcome';
import StepEngine from '../components/onboarding/StepEngine';
import StepVault from '../components/onboarding/StepVault';
import StepDone from '../components/onboarding/StepDone';

const STEPS = ['Boas-vindas', 'Motor', 'Vault', 'Pronto'];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    agencyName: '',
    engine: 'gemini-cli' as 'gemini-cli' | 'openclaw' | 'hermes',
    vaultPath: null as string | null,
  });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background orbs */}
      <div className="orb-teal"  style={{ width: 600, height: 600, top: '-15%',  left: '-10%' }} />
      <div className="orb-amber" style={{ width: 700, height: 700, bottom: '-20%', right: '-15%' }} />

      {/* Header: logo + step dots */}
      <header className="flex items-center justify-between px-8 py-6 z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00F5E6, #00b4d8)',
              boxShadow: '0 0 18px rgba(0,245,230,0.35)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-space font-bold text-lg text-white tracking-tight">
            Nexus<span style={{ color: 'var(--primary)' }}>.Studio</span>
          </span>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const state = num === step ? 'active' : num < step ? 'done' : 'future';
            return (
              <div key={i} title={label} className={`step-dot ${state}`} />
            );
          })}
        </div>
      </header>

      {/* Step label */}
      <div className="text-center pt-2 z-10">
        <span className="text-xs font-space font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Passo {step} de {STEPS.length} — {STEPS[step - 1]}
        </span>
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-10 z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepWelcome
              key="welcome"
              onNext={(d) => { setData(prev => ({ ...prev, agencyName: d.agencyName })); setStep(2); }}
            />
          )}
          {step === 2 && (
            <StepEngine
              key="engine"
              onNext={(d) => { setData(prev => ({ ...prev, engine: d.engine })); setStep(3); }}
            />
          )}
          {step === 3 && (
            <StepVault
              key="vault"
              onNext={(d) => { setData(prev => ({ ...prev, vaultPath: d.vaultPath })); setStep(4); }}
            />
          )}
          {step === 4 && (
            <StepDone
              key="done"
              agencyName={data.agencyName}
              engine={data.engine}
              vaultPath={data.vaultPath}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
