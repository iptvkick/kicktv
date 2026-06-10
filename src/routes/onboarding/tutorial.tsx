import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { Copy, Check, Tv, Loader2, ArrowRight, Play, Monitor, Smartphone, CheckCircle2 } from 'lucide-react'

type TutorialSearch = {
  device?: string
}

export const Route = createFileRoute('/onboarding/tutorial')({
  validateSearch: (search: Record<string, unknown>): TutorialSearch => {
    return {
      device: search.device as string | undefined,
    }
  },
  component: OnboardingFlow,
})

const MOCK_DEVICES = [
  { id: '1', name: 'Smart TV Samsung / LG', icon: Tv },
  { id: '2', name: 'Roku TV / Roku Express', icon: Monitor },
  { id: '3', name: 'Fire TV Stick / Android TV', icon: Tv },
  { id: '4', name: 'Celular / Computador', icon: Smartphone },
];

const MOCK_STEPS = [
  {
    id: 's1',
    title: 'Baixe o Aplicativo',
    description: 'Vá na loja de aplicativos da sua TV e procure por "Smarters Player Lite" ou "IBO Player". Clique em instalar e aguarde.',
  },
  {
    id: 's2',
    title: 'Abra o Aplicativo',
    description: 'Ao abrir, você verá uma tela pedindo usuário, senha e URL. Não feche esta tela, você precisará dos dados a seguir.',
  },
  {
    id: 's3',
    title: 'Gere seu Teste Grátis',
    description: 'Tudo pronto! Clique no botão abaixo para gerar suas credenciais exclusivas e começar a assistir agora mesmo.',
  }
];

function OnboardingFlow() {
  const { device } = Route.useSearch()
  const navigate = useNavigate()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDevice, setSelectedDevice] = useState(device || '')
  
  const [generatingTrial, setGeneratingTrial] = useState(false)
  const [showTrialModal, setShowTrialModal] = useState(false)
  const [credentials, setCredentials] = useState<{url: string, user: string, pass: string} | null>(null)
  const [copied, setCopied] = useState<'url' | 'user' | 'pass' | null>(null)
  const [collectedName, setCollectedName] = useState('')

  const handleNextStep = () => {
    if (currentStep < MOCK_STEPS.length - 1) {
      setCurrentStep(curr => curr + 1)
    } else {
      generateTrial()
    }
  }

  const generateTrial = async () => {
    setGeneratingTrial(true)
    try {
      // Upsert full_name in profiles if collected
      if (collectedName.trim()) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('profiles').upsert(
            { id: user.id, full_name: collectedName.trim() },
            { onConflict: 'id' }
          )
        }
      }

      // Call real Edge Function
      const { data, error } = await supabase.functions.invoke('generate-trial')
      if (error) throw error

      setCredentials({
        url: data?.url || data?.server_url || '',
        user: data?.username || data?.user || '',
        pass: data?.password || data?.pass || '',
      })
      setShowTrialModal(true)
    } catch (err: any) {
      console.error('Erro ao gerar trial:', err)
      alert('Não foi possível gerar seu acesso trial. Tente novamente.')
    } finally {
      setGeneratingTrial(false)
    }
  }

  const copyToClipboard = (text: string, type: 'url' | 'user' | 'pass') => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!selectedDevice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-x-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full z-10"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-foreground">
              Onde você vai assistir?
            </h1>
            <p className="text-foreground/60 text-lg">Selecione o seu aparelho para ver o passo a passo exato de instalação.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_DEVICES.map((dev) => {
              const Icon = dev.icon
              return (
                <button
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev.id)}
                  className="bg-card border border-border p-6 rounded-[24px] flex items-center gap-6 hover:bg-black/5 transition-colors group text-left"
                >
                  <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Icon className="w-7 h-7 text-foreground/70 group-hover:text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">{dev.name}</h3>
                    <p className="text-sm text-foreground/50 mt-1">Ver tutorial de instalação</p>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-x-hidden">
      <div className="max-w-xl w-full z-10 flex flex-col items-center">
        
        <div className="w-full flex items-center gap-2 mb-12">
          {MOCK_STEPS.map((_, idx) => (
            <div key={idx} className={`h-2 rounded-full flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-primary' : 'bg-black/10'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-[32px] p-8 md:p-10 w-full"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/5 text-foreground mb-6 font-bold text-xl">
              {currentStep + 1}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">
              {MOCK_STEPS[currentStep].title}
            </h2>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              {MOCK_STEPS[currentStep].description}
            </p>

            {currentStep === MOCK_STEPS.length - 1 ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">
                    Seu Nome (opcional)
                  </label>
                  <input
                    type="text"
                    value={collectedName}
                    onChange={(e) => setCollectedName(e.target.value)}
                    placeholder="Como podemos te chamar?"
                    className="bg-background text-foreground px-4 py-3 rounded-2xl border border-border focus:outline-none focus:border-primary font-medium transition-colors"
                  />
                </div>
                <button
                  onClick={handleNextStep}
                  disabled={generatingTrial}
                  className="w-full h-16 rounded-2xl bg-primary hover:opacity-90 text-primary-foreground font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {generatingTrial ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Gerando seu acesso...</>
                  ) : (
                    <><Play className="w-6 h-6 fill-current" /> Instalei, Gerar Teste</>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleNextStep}
                className="w-full h-16 rounded-2xl border border-border bg-background text-foreground font-bold text-lg transition-all flex items-center justify-center gap-2 hover:bg-black/5"
              >
                Próximo Passo <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      <AnimatePresence>
        {showTrialModal && credentials && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-[32px] p-8 max-w-md w-full relative z-10"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-accent rounded-full flex items-center justify-center border-4 border-background">
                <CheckCircle2 className="w-12 h-12 text-accent-foreground" />
              </div>

              <div className="text-center mt-10 mb-8">
                <h3 className="text-2xl font-black text-foreground">Teste Liberado!</h3>
                <p className="text-foreground/60 mt-2">Insira os dados abaixo no aplicativo que você acabou de instalar.</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'URL / DNS', value: credentials.url, key: 'url' as const },
                  { label: 'Usuário', value: credentials.user, key: 'user' as const },
                  { label: 'Senha', value: credentials.pass, key: 'pass' as const },
                ].map((item) => (
                  <div key={item.key} className="relative">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-4 mb-1 block">
                      {item.label}
                    </label>
                    <div className="flex bg-background rounded-2xl border border-border overflow-hidden">
                      <input 
                        readOnly 
                        value={item.value} 
                        className="flex-1 bg-transparent px-4 py-4 text-foreground font-medium outline-none"
                      />
                      <button 
                        onClick={() => copyToClipboard(item.value, item.key)}
                        className="w-16 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors border-l border-border"
                      >
                        {copied === item.key ? <Check className="w-5 h-5 text-accent" /> : <Copy className="w-5 h-5 text-foreground/70" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate({ to: '/cliente/dashboard' })}
                className="w-full h-14 mt-8 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold transition-colors"
              >
                Ir para meu Painel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
