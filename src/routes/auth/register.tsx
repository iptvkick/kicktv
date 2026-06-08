import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
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
        data: {
          full_name: name,
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Sucesso
    navigate({ to: '/cliente/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card p-8 rounded-[32px] shadow-sm border border-black/5">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Criar Conta</h1>
          <p className="text-foreground/60 text-sm mt-2">Comece a assistir agora mesmo.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-semibold">
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
              className="bg-background px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium" 
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-foreground/50">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium" 
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-foreground/50">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium" 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-white h-14 rounded-xl font-bold mt-2 hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Conta e Continuar'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/60">
          Já tem conta? <Link to="/auth/login" className="font-bold text-accent hover:underline">Fazer Login</Link>
        </div>
      </div>
    </div>
  )
}
