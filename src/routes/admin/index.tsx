import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, CreditCard, Activity, ArrowUpRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, trials: 0, revenue: 0, conversion: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [{ count: activeCount }, { count: trialCount }, { data: payments }, { data: subs }, { data: serversData }] =
        await Promise.all([
          supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "trialing"),
          supabase.from("payments").select("valor").eq("status", "pago").gte("created_at", startOfMonth.toISOString()),
          supabase
            .from("subscriptions")
            .select("id, status, created_at, expires_at, profiles(email), plans(name)")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.from("servers").select("*").order("created_at", { ascending: true }).limit(5),
        ]);

      const revenue = (payments ?? []).reduce((acc, p: any) => acc + Number(p.valor || 0), 0);
      const total = (activeCount ?? 0) + (trialCount ?? 0);
      const conversion = total > 0 ? Math.round(((activeCount ?? 0) / total) * 100) : 0;

      setStats({ active: activeCount ?? 0, trials: trialCount ?? 0, revenue, conversion });
      setRecent(subs ?? []);
      setServers(serversData ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#212529]" />
      </div>
    );
  }

  const cards = [
    { label: "Usuários Ativos", value: stats.active.toString(), icon: Users },
    {
      label: "Receita Mensal",
      value: `R$ ${stats.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: CreditCard,
    },
    { label: "Trials Ativos", value: stats.trials.toString(), icon: Activity },
    { label: "Conversão", value: `${stats.conversion}%`, icon: ArrowUpRight },
  ];

  function statusStyle(s: string) {
    if (s === "active") return "bg-emerald-100 text-emerald-700";
    if (s === "trialing") return "bg-amber-100 text-amber-700";
    if (s === "past_due") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  }

  function timeAgo(d: string) {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (diff < 60) return `Há ${diff} min`;
    if (diff < 1440) return `Há ${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)} dias atrás`;
  }

  return (
    <div className="flex flex-col p-8 md:p-12 w-full max-w-7xl mx-auto gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Visão Geral</h1>
        <p className="text-gray-500">Métricas e acompanhamento do SaaS.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{c.label}</span>
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <span className="text-3xl font-black text-gray-900 tracking-tight">{c.value}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900">Últimas Assinaturas</h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="grid grid-cols-4 border-b border-gray-50 pb-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span>Usuário</span>
              <span>Plano</span>
              <span>Status</span>
              <span className="text-right">Quando</span>
            </div>
            {recent.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">Nenhum registro ainda.</div>
            ) : (
              recent.map((r: any) => (
                <div key={r.id} className="grid grid-cols-4 items-center py-3 border-b border-gray-50 last:border-0">
                  <span className="font-bold text-sm text-gray-900 truncate pr-2">{r.profiles?.email ?? "—"}</span>
                  <span className="text-sm text-gray-600 truncate pr-2">{r.plans?.name ?? "Trial"}</span>
                  <div>
                    <span className={`${statusStyle(r.status)} text-xs font-bold px-2.5 py-1 rounded-md capitalize`}>
                      {r.status}
                    </span>
                  </div>
                  <span className="text-right text-xs text-gray-400">{timeAgo(r.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900">Servidores</h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
            {servers.length === 0 ? (
              <div className="text-sm text-gray-400">Nenhum servidor cadastrado.</div>
            ) : (
              servers.map((s: any) => (
                <div key={s.id} className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${s.is_active ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-red-500"}`} />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900">{s.name}</span>
                    <span className="text-xs text-gray-500">{s.dns_url ?? s.m3u_url ?? ""}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
