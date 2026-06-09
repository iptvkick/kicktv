import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Server, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/servidores")({
  component: ServidoresAdminPage,
});

interface ServerRow {
  id: string;
  name: string;
  m3u_url: string;
  dns_url: string;
  is_active: boolean;
}

function ServidoresAdminPage() {
  const [servers, setServers] = useState<ServerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", m3u_url: "", dns_url: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    const { data } = await supabase.from("servers").select("*").order("created_at", { ascending: true });
    setServers((data as ServerRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { error: err } = await supabase.from("servers").insert({
      name: form.name,
      m3u_url: form.m3u_url,
      dns_url: form.dns_url,
      is_active: true,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setForm({ name: "", m3u_url: "", dns_url: "" });
    setShowForm(false);
    reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este servidor?")) return;
    await supabase.from("servers").delete().eq("id", id);
    reload();
  }

  async function toggleActive(s: ServerRow) {
    await supabase.from("servers").update({ is_active: !s.is_active }).eq("id", s.id);
    reload();
  }

  return (
    <div className="flex flex-col gap-8 p-8 md:p-12 w-full max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Servidores Xtream</h1>
          <p className="text-sm text-gray-500 mt-1">Cadastre e gerencie seus painéis de IPTV.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#212529] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancelar" : "Novo Servidor"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              required
              placeholder="Nome (ex: BR Principal)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#212529]/20"
            />
            <input
              required
              placeholder="URL M3U"
              value={form.m3u_url}
              onChange={(e) => setForm({ ...form, m3u_url: e.target.value })}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#212529]/20"
            />
            <input
              required
              placeholder="DNS / Painel URL"
              value={form.dns_url}
              onChange={(e) => setForm({ ...form, dns_url: e.target.value })}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#212529]/20"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="self-start bg-[#212529] text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
          >
            {submitting ? "Salvando..." : "Salvar servidor"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : servers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <Server className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium text-gray-900 mb-1">Nenhum servidor cadastrado</p>
          <p className="text-sm">Clique em "Novo Servidor" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {servers.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Server className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900">{s.name}</h3>
                  <span className="text-xs text-gray-500 font-mono">{s.dns_url}</span>
                  <span className="text-xs text-gray-400 font-mono">{s.m3u_url}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleActive(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    s.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {s.is_active ? "Ativo" : "Inativo"}
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
