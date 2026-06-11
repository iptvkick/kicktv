import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Tv, Smartphone, Monitor, Cast, CheckCircle2, Home, HelpCircle, LogIn } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const DEVICES = [
  { id: 'smart-tv', name: 'Smart TV', icon: Tv, description: 'TV Inteligente' },
  { id: 'android', name: 'Android', icon: Smartphone, description: 'Celular ou Tablet' },
  { id: 'iphone', name: 'iPhone / iPad', icon: Smartphone, description: 'iOS' },
  { id: 'pc', name: 'Computador', icon: Monitor, description: 'Windows ou Mac' },
  { id: 'tv-box', name: 'TV Box', icon: Cast, description: 'Android TV / Roku' },
]

function LandingPage() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<any[]>([])
  const [plansLoading, setPlansLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        setPlans(data || [])
        setPlansLoading(false)
      })
  }, [])

  const handleDeviceClick = (deviceId: string) => {
    navigate({ to: '/auth/register', search: { device: deviceId } })
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-accent selection:text-primary-foreground overflow-x-hidden">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">KickTV</Link>
          <div className="hidden md:flex gap-4 items-center">
            <Link to="/suporte" className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors">Suporte</Link>
            <Link to="/auth/login" className="text-sm font-bold bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:opacity-90 transition-all">
              Fazer Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-3xl mx-auto mt-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Sua TV, <br/><span className="text-foreground/40">Reinventada.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-foreground/60 leading-relaxed max-w-2xl mx-auto"
          >
            Toda a sua TV em um só lugar. Sem exceção. Canais, filmes, séries e esportes ao vivo. Compatível com todos os seus aparelhos.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link to="/auth/register" className="bg-primary text-primary-foreground h-14 px-8 rounded-full flex items-center justify-center font-bold text-lg hover:opacity-90 transition-all">
              Teste Grátis por 4 Horas
            </Link>
            <a href="#planos" className="bg-card text-foreground h-14 px-8 rounded-full flex items-center justify-center font-bold text-lg border border-border hover:bg-card/90 transition-colors">
              Ver Planos
            </a>
          </motion.div>
        </section>

        {/* Device Selection (Funil Entry) */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Onde você quer assistir?</h2>
            <p className="text-foreground/60 mt-2">Escolha seu aparelho e libere seu teste agora.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {DEVICES.map((device, i) => (
              <motion.button
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleDeviceClick(device.id)}
                className="bg-card p-6 rounded-[24px] border border-border hover:bg-card/90 transition-colors flex flex-col items-center text-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                  <device.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{device.name}</h3>
                  <p className="text-sm text-foreground/50">{device.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Pricing — Dynamic from Supabase */}
        <section id="planos" className="space-y-12 pt-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight">Planos simples e diretos.</h2>
            <p className="text-foreground/60 mt-3 text-lg">Sem taxas escondidas. Cancele quando quiser.</p>
          </div>

          {plansLoading ? (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[0, 1].map(i => (
                <div key={i} className="bg-card p-8 rounded-[32px] border border-black/5 animate-pulse">
                  <div className="h-6 w-32 bg-border rounded-md mb-4" />
                  <div className="h-10 w-20 bg-border rounded-md mb-8" />
                  <div className="space-y-3 mb-8">
                    {[0,1,2,3].map(j => <div key={j} className="h-4 bg-border rounded-md" />)}
                  </div>
                  <div className="h-14 bg-border rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan, i) => {
                const isPrimary = i === 1 || (plans.length === 1)
                const price = plan.base_price ?? plan.price_monthly ?? 0
                const features: string[] = [
                  plan.description || 'Acesso completo a canais, filmes e séries',
                  `${plan.max_connections || 1} Tela${(plan.max_connections || 1) > 1 ? 's' : ''} inclusa${(plan.max_connections || 1) > 1 ? 's' : ''}`,
                  'Tecnologia híbrida Anti-Travamento',
                  'Suporte 24/7',
                ]
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={isPrimary
                      ? 'bg-accent text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden'
                      : 'bg-card p-8 rounded-[32px] border border-black/5 shadow-sm relative overflow-hidden'
                    }
                  >
                    {isPrimary && plans.length > 1 && (
                      <div className="absolute top-0 right-8 bg-white text-accent px-4 py-1 rounded-b-xl text-sm font-bold shadow-sm">
                        Mais Popular
                      </div>
                    )}
                    <h3 className={`text-2xl font-bold ${isPrimary ? 'text-accent-foreground' : ''}`}>
                      {plan.name}
                    </h3>
                    <div className="mt-4 mb-8 flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold tracking-tight ${isPrimary ? 'text-accent-foreground' : ''}`}>
                        R$ {Number(price).toFixed(0)}
                      </span>
                      <span className={isPrimary ? 'text-accent-foreground/70' : 'text-foreground/50'}>/mês</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {features.map(feature => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${isPrimary ? 'text-accent-foreground' : 'text-accent'}`} />
                          <span className={`font-medium ${isPrimary ? 'text-accent-foreground/90' : 'text-foreground/80'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/auth/register"
                      className={isPrimary
                        ? 'w-full bg-card text-foreground h-14 rounded-full flex items-center justify-center font-bold text-lg hover:bg-card/90 transition-colors'
                        : 'w-full bg-primary text-primary-foreground h-14 rounded-full flex items-center justify-center font-bold text-lg hover:opacity-90 transition-colors'
                      }
                    >
                      Começar Trial
                    </Link>
                  </motion.div>
                )
              })}

              {/* Fallback if no plans returned */}
              {plans.length === 0 && !plansLoading && (
                <div className="col-span-2 text-center text-foreground/50 py-12">
                  Planos em breve. <Link to="/auth/register" className="text-primary font-bold hover:underline">Cadastre-se</Link> para ser notificado.
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      
      {/* Footer minimalista */}
      <footer className="border-t border-border py-12 text-center text-foreground/50 text-sm pb-24 md:pb-12">
        <p>© 2026 KickTV. Todos os direitos reservados.</p>
      </footer>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground rounded-full px-6 py-3 flex items-center gap-6 md:hidden shadow-sm">
        <Link to="/" className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100">
          <Home className="w-5 h-5" />
        </Link>
        <Link to="/suporte" className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100">
          <HelpCircle className="w-5 h-5" />
        </Link>
        <Link to="/auth/login" className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100">
          <LogIn className="w-5 h-5" />
        </Link>
      </nav>
    </div>
  )
}
