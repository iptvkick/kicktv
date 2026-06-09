"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tv, Smartphone, Monitor, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DEVICES = [
  { id: "tv", name: "Smart TV", icon: Tv, description: "Samsung, LG, Roku, Android TV" },
  { id: "mobile", name: "Celular / Tablet", icon: Smartphone, description: "iPhone, iPad, Android" },
  { id: "pc", name: "Computador", icon: Monitor, description: "Windows, Mac, Navegador Web" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground relative grain overflow-hidden">
      
      {/* Mesh Gradient Decorativo (Glow / Atmosfera) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/20 blur-[100px] rounded-full pointer-events-none opacity-40" />

      {/* Navbar Glassmórfica */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 rounded-b-3xl">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-extrabold tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">K</span>
            KickTV
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/auth/login">
              <Button variant="outline" className="font-bold rounded-full hover-lift border-white/10 bg-white/5 backdrop-blur-md text-white">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 space-y-32 relative z-10">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto mt-12 md:mt-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[5.5rem] font-display font-extrabold tracking-tighter leading-[1.05]"
          >
            Sua TV, <br/>
            <span className="text-primary drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">Reinventada.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Toda a sua TV em um só lugar. Sem exceção. Canais, filmes, séries e esportes ao vivo. Compatível com todos os seus aparelhos.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
          >
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-8 rounded-full font-bold text-lg animate-cta-pulse hover-lift bg-primary text-primary-foreground hover:bg-primary/90">
                Teste Grátis por 4 Horas
              </Button>
            </Link>
            <a href="#planos" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full h-14 px-8 rounded-full font-bold text-lg hover-lift glass-panel border-white/10">
                Ver Planos
              </Button>
            </a>
          </motion.div>
        </section>

        {/* Device Selection */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-display font-bold tracking-tight">Onde você quer assistir?</h2>
            <p className="text-muted-foreground mt-2 text-lg">Escolha seu aparelho e libere seu teste agora.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEVICES.map((device, i) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-panel border-white/10 hover-lift h-full bg-card/40 hover:bg-card/60 transition-colors cursor-pointer group border-b-2 hover:border-b-primary">
                  <CardContent className="flex flex-col items-center text-center gap-6 p-8">
                    <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner">
                      <device.icon className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-2xl mb-2">{device.name}</h3>
                      <p className="text-muted-foreground">{device.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="planos" className="space-y-16 pt-12">
          <div className="text-center">
            <h2 className="text-5xl font-display font-bold tracking-tight">Planos simples e diretos.</h2>
            <p className="text-muted-foreground mt-4 text-xl">Sem taxas escondidas. Cancele quando quiser.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Essencial */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="glass-panel border-white/10 h-full flex flex-col hover-lift bg-card/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-display font-bold">Essencial</CardTitle>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-display font-extrabold tracking-tight">R$ 35</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <ul className="space-y-4 mb-8">
                    {[
                      'Acesso completo a canais, filmes e séries',
                      '1 Tela inclusa',
                      'Tecnologia híbrida Anti-Travamento',
                      'Suporte 24/7'
                    ].map(feature => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/auth/login" className="w-full mt-auto">
                    <Button variant="secondary" className="w-full h-14 rounded-full font-bold text-lg hover-lift">
                      Começar Teste
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Plano Premium */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="glass-panel border-primary/50 relative overflow-hidden h-full flex flex-col hover-lift bg-primary/5">
                {/* Glow Background do Card Premium */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute top-0 right-8 bg-primary text-primary-foreground px-4 py-1 rounded-b-xl text-sm font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                  Mais Popular
                </div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl font-display font-bold">Premium 4K</CardTitle>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-display font-extrabold tracking-tight text-primary">R$ 45</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
                  <ul className="space-y-4 mb-8">
                    {[
                      'Tudo do Essencial',
                      'Catálogo Nexus On-Demand',
                      'Interface Ultra Fluida',
                      'Conteúdo +18 Opcional'
                    ].map(feature => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 drop-shadow-[0_0_5px_rgba(37,99,235,0.8)]" />
                        <span className="font-medium text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/auth/login" className="w-full mt-auto">
                    <Button className="w-full h-14 rounded-full font-bold text-lg hover-lift bg-primary text-primary-foreground shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                      Começar Teste
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer Minimalista */}
      <footer className="border-t border-white/10 py-12 text-center text-muted-foreground text-sm relative z-10 glass-panel bg-transparent rounded-none mt-12">
        <p>© 2026 KickTV. Todos os direitos reservados. "A Interface do Usuário é o Produto".</p>
      </footer>
    </div>
  );
}
