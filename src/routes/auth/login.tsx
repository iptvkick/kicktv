import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { Loader2 } from 'lucide-react'

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

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // No profile found, default to client
          navigate({ to: '/cliente/dashboard' })
          return
        }
        console.error('Erro ao buscar profile:', profileError)
        setError('Erro ao verificar nível de acesso.')
        setLoading(false)
        return
      }

      if (profile?.role === 'admin') {
        navigate({ to: '/admin/servidores' })
      } else {
        navigate({ to: '/cliente/dashboard' })
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa] font-sans relative overflow-hidden px-6">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-black/5 shadow-xl p-6 md:p-8 rounded-[32px]">
          <div className="text-center space-y-4 pb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
              K
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Bem-vindo de volta</h1>
            <p className="text-zinc-600 text-base">Acesse sua conta para continuar.</p>
          </div>
          
          <div>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl font-semibold text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 h-14 px-4 rounded-xl focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-zinc-900 font-medium"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Senha</label>
                  <a href="#" className="text-xs font-medium text-zinc-900 hover:underline">Esqueceu a senha?</a>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 h-14 px-4 rounded-xl focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-zinc-900 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center bg-zinc-900 text-white mt-2 shadow-md hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Entrar na Conta"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
