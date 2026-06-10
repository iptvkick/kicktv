import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { Beaker, ShieldAlert, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export function CheckoutSimulator({ invoiceId }: { invoiceId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // Only render in Sandbox mode
  if (import.meta.env.VITE_SANDBOX_MODE !== 'true') {
    return null
  }

  const simulateWebhook = async (status: 'RECEIVED' | 'OVERDUE') => {
    if (!invoiceId) {
      setResult('ID da fatura não fornecido.')
      return
    }
    
    setLoading(true)
    setResult(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('asaas-simulate', {
        body: { invoice_id: invoiceId, status }
      })
      
      if (error) throw error
      
      setResult(`Simulação: ${status} disparado.`)
      setTimeout(() => setResult(null), 3000)
    } catch (err: any) {
      setResult(`Erro: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 bg-zinc-950 border border-amber-500/30 p-4 rounded-2xl shadow-2xl w-72 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Sandbox Mode</span>
            </div>
            
            <p className="text-xs text-zinc-400 font-medium">
              Simule o pagamento via PIX disparando o Webhook localmente.
            </p>

            <div className="flex gap-2">
              <button
                disabled={loading || !invoiceId}
                onClick={() => simulateWebhook('RECEIVED')}
                className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border border-emerald-500/30 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                Pagar PIX
              </button>
              
              <button
                disabled={loading || !invoiceId}
                onClick={() => simulateWebhook('OVERDUE')}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                Falhar
              </button>
            </div>

            {result && (
              <p className="text-[10px] text-center font-mono mt-1 text-zinc-300">{result}</p>
            )}
            
            {!invoiceId && (
              <p className="text-[10px] text-center text-amber-500/70">Aguardando geração da fatura...</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-zinc-950 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-500 shadow-xl hover:scale-105 transition-transform"
      >
        <Beaker className="w-5 h-5" />
      </button>
    </div>
  )
}
