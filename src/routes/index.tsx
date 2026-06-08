import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Tv, Smartphone, Monitor, Cast, CheckCircle2 } from 'lucide-react'

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

  const handleDeviceClick = (deviceId: string) => {
    navigate({ to: '/auth/register', search: { device: deviceId } })
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight">KickTV</Link>
          <div className="flex gap-4 items-center">
            <Link to="/suporte" className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors">Suporte</Link>
            <Link to="/auth/login" className="text-sm font-bold bg-white border border-black/5 shadow-sm px-5 py-2.5 rounded-full hover:shadow-md transition-all active:scale-95">
              Fazer Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-3xl mx-auto mt-12">
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
            <Link to="/auth/register" className="bg-accent text-white h-14 px-8 rounded-full flex items-center justify-center font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
              Teste Grátis por 4 Horas
            </Link>
            <a href="#planos" className="bg-white text-accent h-14 px-8 rounded-full flex items-center justify-center font-bold text-lg border border-black/5 shadow-sm hover:bg-gray-50 transition-colors">
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
                className="bg-card p-6 rounded-[24px] border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-4 group"
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

        {/* Pricing Preview */}
        <section id="planos" className="space-y-12 pt-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight">Planos simples e diretos.</h2>
            <p className="text-foreground/60 mt-3 text-lg">Sem taxas escondidas. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Essencial */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-[32px] border border-black/5 shadow-sm relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold">Essencial</h3>
              <div className="mt-4 mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">R$ 35</span>
                <span className="text-foreground/50">/mês</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Acesso completo a canais, filmes e séries',
                  '1 Tela inclusa',
                  'Tecnologia híbrida Anti-Travamento',
                  'Suporte 24/7'
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    <span className="font-medium text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth/register" className="w-full bg-background border border-black/10 text-foreground h-14 rounded-full flex items-center justify-center font-bold text-lg hover:bg-black/5 transition-colors">
                Começar Teste
              </Link>
            </motion.div>

            {/* Plano Premium */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-accent text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-8 bg-white text-accent px-4 py-1 rounded-b-xl text-sm font-bold shadow-sm">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold">Premium 4K</h3>
              <div className="mt-4 mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">R$ 45</span>
                <span className="text-white/70">/mês</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Tudo do Essencial',
                  'Catálogo Nexus On-Demand',
                  'Interface Ultra Fluida',
                  'Conteúdo +18 Opcional'
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white/90" />
                    <span className="font-medium text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth/register" className="w-full bg-white text-accent h-14 rounded-full flex items-center justify-center font-bold text-lg hover:bg-gray-100 transition-colors">
                Começar Teste
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer minimalista */}
      <footer className="border-t border-black/5 py-12 text-center text-foreground/50 text-sm">
        <p>© 2026 KickTV. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
