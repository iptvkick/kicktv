"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.warn("Perfil não encontrado ou erro. Fallback para Cliente.", profileError);
        router.push("/cliente/dashboard");
        return;
      }

      console.log("Profile retornado:", profile);

      if (profile?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/cliente/dashboard");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans text-foreground relative overflow-hidden px-6">
      
      {/* Abstract Glow Backgrounds - Claro */}
      <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-100 blur-[120px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-slate-200 blur-[100px] rounded-full pointer-events-none opacity-50" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-panel border-gray-200 shadow-xl p-4 md:p-6 bg-white/80">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-extrabold text-xl shadow-md">
              K
            </div>
            <CardTitle className="text-3xl font-display font-bold tracking-tight text-gray-900">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-muted-foreground text-base">Acesse sua conta KickTV para continuar.</CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/20 text-destructive-foreground">
                <AlertDescription className="font-semibold text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">E-mail</Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-white border-gray-200 h-14 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-gray-900 font-medium"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Senha</Label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline">Esqueceu a senha?</a>
                </div>
                <Input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-white border-gray-200 h-14 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary text-gray-900 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl font-bold text-lg hover-lift bg-primary text-primary-foreground mt-2 shadow-md transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Entrar na Conta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

import { motion } from "framer-motion";
