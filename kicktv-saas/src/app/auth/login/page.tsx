"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

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
        console.error("Erro ao buscar profile:", profileError);
        setError("Erro ao verificar nível de acesso.");
        setLoading(false);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f6f7] px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-[#212529] mb-2">Bem-vindo de volta</h1>
        <p className="text-gray-500 mb-8">Acesse sua conta para continuar.</p>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-[#f5f6f7] p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#212529] transition-all text-[#212529] font-medium"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-[#f5f6f7] p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#212529] transition-all text-[#212529] font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-[#212529] text-white p-4 rounded-xl font-bold text-lg hover:bg-[#343a40] transition-colors flex items-center justify-center h-14"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Entrar na Conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
