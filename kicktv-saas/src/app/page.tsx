"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tv, Smartphone, Monitor, CheckCircle2 } from "lucide-react";

const DEVICES = [
  { id: "tv", name: "Smart TV", icon: Tv, description: "Samsung, LG, Roku, Android TV" },
  { id: "mobile", name: "Celular / Tablet", icon: Smartphone, description: "iPhone, iPad, Android" },
  { id: "pc", name: "Computador", icon: Monitor, description: "Windows, Mac, Navegador Web" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] font-sans text-[#212529] selection:bg-[#212529] selection:text-white">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-[#f5f6f7]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">KickTV</Link>
          <div className="flex gap-4 items-center">
            <Link href="/auth/login" className="text-sm font-bold bg-white border border-black/5 shadow-sm px-5 py-2.5 rounded-full hover:shadow-md transition-all active:scale-95 text-[#212529]">
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
            Sua TV, <br/><span className="text-[#212529]/40">Reinventada.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#212529]/60 leading-relaxed max-w-2xl mx-auto"
          >
            Toda a sua TV em um só lugar. Sem exceção. Canais, filmes, séries e esportes ao vivo. Compatível com todos os seus aparelhos.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link href="/auth/login" className="bg-[#212529] text-white h-14 px-8 rounded-full flex items-center justify-center font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
              Teste Grátis por 4 Horas
            </Link>
            <a href="#planos" className="bg-white text-[#212529] h-14 px-8 rounded-full flex items-center justify-center font-bold text-lg border border-black/5 shadow-sm hover:bg-gray-50 transition-colors">
              Ver Planos
            </a>
          </motion.div>
        </section>

        {/* Device Selection */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Onde você quer assistir?</h2>
            <p className="text-[#212529]/60 mt-2">Escolha seu aparelho e libere seu teste agora.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEVICES.map((device, i) => (
              <motion.button
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-full bg-[#f5f6f7] flex items-center justify-center group-hover:bg-[#212529] group-hover:text-white transition-colors">
                  <device.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{device.name}</h3>
                  <p className="text-sm text-[#212529]/50">{device.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="planos" className="space-y-12 pt-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight">Planos simples e diretos.</h2>
            <p className="text-[#212529]/60 mt-3 text-lg">Sem taxas escondidas. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Essencial */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold">Essencial</h3>
              <div className="mt-4 mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">R$ 35</span>
                <span className="text-[#212529]/50">/mês</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Acesso completo a canais, filmes e séries',
                  '1 Tela inclusa',
                  'Tecnologia híbrida Anti-Travamento',
                  'Suporte 24/7'
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#212529]" />
                    <span className="font-medium text-[#212529]/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/login" className="w-full bg-[#f5f6f7] border border-black/10 text-[#212529] h-14 rounded-full flex items-center justify-center font-bold text-lg hover:bg-black/5 transition-colors">
                Começar Teste
              </Link>
            </motion.div>

            {/* Plano Premium */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#212529] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-8 bg-white text-[#212529] px-4 py-1 rounded-b-xl text-sm font-bold shadow-sm">
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

              <Link href="/auth/login" className="w-full bg-white text-[#212529] h-14 rounded-full flex items-center justify-center font-bold text-lg hover:bg-gray-100 transition-colors">
                Começar Teste
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer minimalista */}
      <footer className="border-t border-black/5 py-12 text-center text-[#212529]/50 text-sm">
        <p>© 2026 KickTV. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
