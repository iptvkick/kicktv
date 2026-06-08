import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    // Role redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      navigate({ to: '/admin/servidores' })
    } else {
      navigate({ to: '/cliente/dashboard' })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative">
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-semibold">
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card p-10 rounded-[32px] shadow-sm border border-black/5"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-foreground/60 text-base mt-2">Acesse sua conta para continuar.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm mb-6 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
            className="w-full bg-accent text-white h-16 rounded-full font-bold text-lg mt-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/60">
          Ainda não tem conta? <Link to="/auth/register" className="font-bold text-accent hover:underline">Criar teste grátis</Link>
        </div>
      </motion.div>
    </div>
  )
}
