import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { Copy, Check, Tv, Loader2, ArrowRight } from 'lucide-react'

type TutorialSearch = {
  device?: string
}

export const Route = createFileRoute('/onboarding/tutorial')({
  validateSearch: (search: Record<string, unknown>): TutorialSearch => {
    return {
      device: search.device as string | undefined,
    }
  },
  component: TutorialPage,
})

function TutorialPage() {
  const { device } = Route.useSearch()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [credentials, setCredentials] = useState<{url: string, user: string, pass: string} | null>(null)
  const [youtubeId, setYoutubeId] = useState<string | null>(null)
  const [copied, setCopied] = useState<'url' | 'user' | 'pass' | null>(null)

  useEffect(() => {
    async function loadData() {
      // 1. Check Auth
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate({ to: '/auth/login' })
        return
      }

      // 2. Fetch Device Video (Mock or from DB)
      // Usaremos um video padrão de placeholder se não achar
      const deviceId = device || 'smart-tv'
      const { data: step } = await (supabase as any)
        .from('onboarding_steps')
        .select('video_url')
        .eq('device_id', deviceId)
        .order('step_order', { ascending: true })
        .limit(1)
        .single()
      
      if (step?.video_url) {
        const match = step.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^&?]+)/)
        if (match) setYoutubeId(match[1])
      }

      const { data: sub } = await (supabase as any)
        .from('iptv_subscriptions')
        .select('xtream_username, xtream_password, url_servidor')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (sub) {
        setCredentials({
          url: sub.url_servidor,
          user: sub.xtream_username,
          pass: sub.xtream_password
        })
      } else {
        setCredentials({
          url: 'http://kicktv.me:8080',
          user: session.user.id.substring(0, 8),
          pass: Math.random().toString(36).slice(-8)
        })
      }


      setLoading(false)
    }
    loadData()
  }, [device, navigate])

  const copyToClipboard = (text: string, type: 'url' | 'user' | 'pass') => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <h2 className="text-xl font-bold">Preparando seu acesso...</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground py-12 px-6">
      
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm mb-6">
            <Check className="w-4 h-4" />
            Teste de 4 Horas Liberado!
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Siga o passo a passo</h1>
          <p className="text-foreground/60 text-lg mt-3">Assista ao vídeo e use as credenciais abaixo para entrar no app.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Coluna Esquerda: Player do Video */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-[32px] overflow-hidden shadow-sm border border-black/5"
          >
            <div className="aspect-video bg-black relative">
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 flex-col gap-4">
                  <Tv className="w-16 h-16" />
                  <p>Vídeo tutorial não encontrado</p>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl">Como instalar no seu aparelho</h3>
              <p className="text-foreground/60 mt-1">Siga exatamente como mostrado no vídeo acima.</p>
            </div>
          </motion.div>

          {/* Coluna Direita: Credenciais */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-accent text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Decoração sutil */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            
            <h3 className="text-2xl font-bold mb-8">Suas Credenciais</h3>

            <div className="space-y-6">
              
              {/* URL */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-white/50">URL do Servidor / DNS</label>
                <div className="flex items-center gap-2">
                  <input 
                    readOnly 
                    value={credentials?.url || ''} 
                    className="flex-1 bg-white/10 text-white px-4 py-4 rounded-2xl outline-none font-medium text-lg"
                  />
                  <button 
                    onClick={() => copyToClipboard(credentials?.url || '', 'url')}
                    className="w-14 h-14 shrink-0 bg-white text-accent rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    {copied === 'url' ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Usuário */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-white/50">Usuário</label>
                <div className="flex items-center gap-2">
                  <input 
                    readOnly 
                    value={credentials?.user || ''} 
                    className="flex-1 bg-white/10 text-white px-4 py-4 rounded-2xl outline-none font-medium text-lg"
                  />
                  <button 
                    onClick={() => copyToClipboard(credentials?.user || '', 'user')}
                    className="w-14 h-14 shrink-0 bg-white text-accent rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    {copied === 'user' ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-white/50">Senha</label>
                <div className="flex items-center gap-2">
                  <input 
                    readOnly 
                    value={credentials?.pass || ''} 
                    className="flex-1 bg-white/10 text-white px-4 py-4 rounded-2xl outline-none font-medium text-lg"
                  />
                  <button 
                    onClick={() => copyToClipboard(credentials?.pass || '', 'pass')}
                    className="w-14 h-14 shrink-0 bg-white text-accent rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    {copied === 'pass' ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>

            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <Link to="/cliente/dashboard" className="w-full bg-white text-accent h-16 rounded-full flex items-center justify-center gap-2 font-bold text-lg hover:bg-gray-100 transition-all hover:gap-4">
                Ir para o Painel Completo <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
          </motion.div>

        </div>
      </div>
    </div>
  )
}
