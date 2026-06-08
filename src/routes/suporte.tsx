import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Bug, Wifi, LogIn, MonitorX, HelpCircle, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/suporte')({
  component: SuportePage,
})

const SUPPORT_OPTIONS = [
  { 
    id: 'bug', 
    title: 'Bug no aplicativo', 
    description: 'O app está com problemas ou travando',
    icon: Bug,
    link: 'https://wa.me/5511999999999?text=Estou+com+um+bug+no+aplicativo'
  },
  { 
    id: 'conexao', 
    title: 'Problema de conexão / Buffering', 
    description: 'Vídeo não carrega ou trava muito',
    icon: Wifi,
    link: 'https://wa.me/5511999999999?text=Estou+com+problemas+de+conexao'
  },
  { 
    id: 'login', 
    title: 'Não consegui entrar', 
    description: 'Problemas com login ou senha',
    icon: LogIn,
    link: 'https://wa.me/5511999999999?text=Nao+consigo+entrar+na+minha+conta'
  },
  { 
    id: 'conteudo', 
    title: 'Conteúdo em falta', 
    description: 'Canal específico não funciona ou está faltando',
    icon: MonitorX,
    link: 'https://wa.me/5511999999999?text=Tem+um+conteudo+faltando'
  },
  { 
    id: 'outro', 
    title: 'Outro problema', 
    description: 'Outro tipo de problema não listado',
    icon: HelpCircle,
    link: 'https://wa.me/5511999999999?text=Preciso+de+ajuda'
  },
]

function SuportePage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Qual tipo de <span className="text-accent">suporte</span> você precisa?</h1>
            <p className="text-foreground/60 text-lg mt-3">Selecione a opção que melhor descreve seu problema para falar com nossa equipe.</p>
          </motion.div>
        </div>

        {/* Grid de Opções */}
        <div className="grid md:grid-cols-2 gap-4">
          {SUPPORT_OPTIONS.map((option, i) => (
            <motion.a
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-6 rounded-[24px] border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex gap-5 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                <option.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-xl">{option.title}</h3>
                <p className="text-foreground/50 text-sm mt-1 leading-snug">{option.description}</p>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </div>
  )
}
