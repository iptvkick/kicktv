import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { ArrowLeft, PlayCircle } from 'lucide-react'

// TanStack Router Search Params
type RegisterSearch = {
  device?: string
}

export const Route = createFileRoute('/auth/register')({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => {
    return {
      device: search.device as string | undefined,
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { device } = Route.useSearch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Sucesso - Ir pro tutorial imersivo do dispositivo
    navigate({ to: '/onboarding/tutorial', search: { device: device || 'smart-tv' } })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-semibold">
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-card p-10 rounded-[32px] shadow-sm border border-black/5"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
            <PlayCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quase lá!</h1>
          <p className="text-foreground/60 text-base mt-2">Crie sua conta grátis para liberar seu teste de 4 horas.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm mb-6 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-foreground/50">Nome Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background px-5 py-4 rounded-2xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium transition-all" 
              placeholder="João da Silva"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-foreground/50">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background px-5 py-4 rounded-2xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium transition-all" 
              placeholder="joao@exemplo.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-foreground/50">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background px-5 py-4 rounded-2xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium transition-all" 
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-white h-16 rounded-full font-bold text-lg mt-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? 'Criando Conta...' : 'Liberar meu Acesso'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/60">
          Já tem uma conta? <Link to="/auth/login" className="font-bold text-accent hover:underline">Fazer Login</Link>
        </div>
      </motion.div>
    </div>
  )
}
