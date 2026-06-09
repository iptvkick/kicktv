import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Wallet, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/planos")({
  component: PlanosAdminPage,
});

interface PlanRow {
  id: string;
  name: string;
  price_monthly: number;
  is_active: boolean;
}

function PlanosAdminPage() {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price_monthly: "" });
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    const { data } = await supabase.from("plans").select("*").order("price_monthly", { ascending: true });
    setPlans((data as PlanRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { reload(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const price = parseFloat(form.price_monthly);
    if (isNaN(price)) { setError("Preço inválido"); return; }
    const { error: err } = await supabase.from("plans").insert({
      name: form.name,
      price_monthly: price,
      is_active: true,
    });
    if (err) { setError(err.message); return; }
    setForm({ name: "", price_monthly: "" });
    setShowForm(false);
    reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este plano?")) return;
    await supabase.from("plans").delete().eq("id", id);
    reload();
  }

  return (
    <div className="flex flex-col gap-8 p-8 md:p-12 w-full max-w-7xl mx-auto">
      <header className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Planos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os planos de assinatura disponíveis.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#212529] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancelar" : "Novo Plano"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4">
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Nome (ex: Premium Mensal)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-3 rounded-xl border border-gray-200"
            />
            <input
              required
              type="number"
              step="0.01"
              placeholder="Preço mensal (R$)"
              value={form.price_monthly}
              onChange={(e) => setForm({ ...form, price_monthly: e.target.value })}
              className="px-4 py-3 rounded-xl border border-gray-200"
            />
          </div>
          <button type="submit" className="self-start bg-[#212529] text-white px-6 py-3 rounded-xl font-bold text-sm">
            Salvar plano
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <Wallet className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium text-gray-900 mb-1">Nenhum plano cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-3xl font-black text-[#212529]">
                R$ {Number(p.price_monthly).toFixed(2)}
                <span className="text-sm font-medium text-gray-400 ml-1">/mês</span>
              </div>
              <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-md ${p.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                {p.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
