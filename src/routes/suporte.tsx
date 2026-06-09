import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, Wifi, LogIn, MonitorX, ArrowLeft, Loader2, Wrench } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/suporte')({
  component: SuportePage,
})

const MOCK_SOLUTIONS = [
  { id: '1', issue_type: 'travamento', device_type: 'smart-tv', resolution_text: 'Acesse as Configurações de Rede da sua TV, vá em Avançado e altere o Servidor DNS para 8.8.8.8. Após isso, reinicie a TV e o roteador e teste novamente.' },
  { id: '2', issue_type: 'travamento', device_type: 'roku', resolution_text: 'O Roku pode acumular cache. Vá na tela inicial e pressione: Home (5x), Cima, Rebobinar (2x), Avançar (2x). O Roku irá reiniciar limpando o cache. Isso resolverá os travamentos.' },
];

function SuportePage() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [solution, setSolution] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleIssueSelect = (issue: string) => {
    setSelectedIssue(issue)
    setSelectedDevice(null)
    setSolution(null)
  }

  const handleDeviceSelect = (device: string) => {
    setSelectedDevice(device)
    setLoading(true)
    
    // Simulate DB query for support_solutions
    setTimeout(() => {
      const found = MOCK_SOLUTIONS.find(s => s.issue_type === selectedIssue && s.device_type === device)
      setSolution(found ? found.resolution_text : 'Nenhuma solução automatizada encontrada. Por favor, contate o suporte humano.')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6 relative overflow-x-hidden">
      
      <div className="max-w-4xl mx-auto space-y-12 z-10 relative">
        
        {/* Header */}
        <div className="relative">
          <Link to="/" className="absolute -top-4 left-0 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-semibold">
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Início
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-16"
          >
            <div className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full font-bold text-sm mb-6 text-foreground">
              <Wrench className="w-4 h-4" />
              Troubleshooting Automatizado
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Resolva problemas em <span className="text-accent">segundos</span></h1>
            <p className="text-foreground/60 text-lg mt-3">Selecione o problema que você está enfrentando para obtermos a solução exata.</p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedIssue ? (
            <motion.div 
              key="issues"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-4"
            >
              {[
                { id: 'travamento', title: 'Resolver Travamentos', icon: Wifi, desc: 'Vídeo engasgando ou parando toda hora' },
                { id: 'tela_preta', title: 'Tela Preta / Não Carrega', icon: MonitorX, desc: 'O canal não abre de jeito nenhum' },
                { id: 'login_error', title: 'Erro de Autenticação', icon: LogIn, desc: 'Senha inválida ou conta expirada' },
                { id: 'bug_app', title: 'Bug no Aplicativo', icon: Bug, desc: 'App fechando sozinho ou interface quebrada' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleIssueSelect(opt.id)}
                  className="bg-card border border-border p-6 rounded-[24px] flex items-center gap-6 hover:bg-card/90 transition-colors text-left group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <opt.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{opt.title}</h3>
                    <p className="text-sm text-foreground/50 mt-1">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : !selectedDevice ? (
            <motion.div 
              key="devices"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold mb-6">Em qual dispositivo isso acontece?</h2>
              <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                {[
                  { id: 'smart-tv', label: 'Smart TV (Samsung/LG)' },
                  { id: 'roku', label: 'Roku TV' },
                  { id: 'firestick', label: 'Fire TV Stick / Android TV' },
                  { id: 'mobile', label: 'Celular ou PC' }
                ].map(dev => (
                  <button
                    key={dev.id}
                    onClick={() => handleDeviceSelect(dev.id)}
                    className="bg-card border border-border p-6 rounded-[20px] font-bold text-lg hover:bg-card/90 transition-colors"
                  >
                    {dev.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelectedIssue(null)} className="mt-8 text-foreground/50 hover:text-foreground font-semibold">
                Voltar
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="solution"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="bg-card border border-border p-8 md:p-10 rounded-[32px] w-full max-w-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 bg-accent h-full" />
                
                <h3 className="text-sm text-foreground/50 font-bold mb-2 uppercase tracking-wider">Solução Encontrada</h3>
                <h2 className="text-3xl font-black mb-6">Siga estes passos:</h2>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-10 h-10 animate-spin text-accent mb-4" />
                    <p className="text-foreground/50">Buscando na base de conhecimento...</p>
                  </div>
                ) : (
                  <p className="text-lg leading-relaxed text-foreground/80 bg-background p-6 rounded-[20px] border border-border">
                    {solution}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button onClick={() => handleIssueSelect(selectedIssue)} className="px-6 py-3 rounded-full bg-card border border-border hover:bg-card/90 font-bold transition-colors">
                  Tentar outro dispositivo
                </button>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 font-bold transition-colors text-center">
                  Falar com Humano
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
