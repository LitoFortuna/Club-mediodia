import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listShowsAdmin,
  createShow,
  updateShow,
  deleteShow,
} from "@/api/shows-admin.functions";
import type { Show } from "@/lib/types";

export const Route = createFileRoute("/shows-admin")({
  head: () => ({
    meta: [
      { title: "Gestionar conciertos — Club Mediodía" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ShowsAdminPage,
});

type FormState = {
  city: string;
  venue: string;
  show_date: string;
  show_time: string;
  sold_out: boolean;
  ticket_url: string;
  poster_url: string;
};

const EMPTY_FORM: FormState = {
  city: "",
  venue: "",
  show_date: "",
  show_time: "",
  sold_out: false,
  ticket_url: "",
  poster_url: "",
};

function showToForm(s: Show): FormState {
  return {
    city: s.city,
    venue: s.venue,
    show_date: s.show_date,
    show_time: s.show_time ?? "",
    sold_out: s.sold_out,
    ticket_url: s.ticket_url ?? "",
    poster_url: s.poster_url ?? "",
  };
}

function ShowsAdminPage() {
  const list = useServerFn(listShowsAdmin);
  const create = useServerFn(createShow);
  const update = useServerFn(updateShow);
  const del = useServerFn(deleteShow);

  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [shows, setShows] = useState<Show[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!pin.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await list({ data: { pin } });
      if (!res.ok) {
        setError(res.message || "PIN incorrecto.");
        setUnlocked(false);
      } else {
        setShows(res.shows);
        setUnlocked(true);
      }
    } catch {
      setError("No se pudo cargar el listado.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    const res = await list({ data: { pin } });
    if (res.ok) setShows(res.shows);
  };

  const startCreate = () => {
    setEditingId("new");
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const startEdit = (s: Show) => {
    setEditingId(s.id);
    setForm(showToForm(s));
    setFormError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setNotice("");
    try {
      const fields = {
        city: form.city,
        venue: form.venue,
        show_date: form.show_date,
        show_time: form.show_time,
        sold_out: form.sold_out,
        ticket_url: form.ticket_url,
        poster_url: form.poster_url,
      };
      const res =
        editingId === "new"
          ? await create({ data: { pin, fields } })
          : await update({ data: { pin, id: editingId as string, fields } });

      if (!res.ok) {
        setFormError(res.message);
      } else {
        setNotice(res.message);
        cancelEdit();
        await refresh();
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Datos inválidos.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (s: Show) => {
    if (!confirm(`¿Eliminar el concierto de ${s.venue} (${s.show_date})?`)) return;
    setNotice("");
    const res = await del({ data: { pin, id: s.id } });
    setNotice(res.message);
    await refresh();
  };

  if (!unlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background">
        <form onSubmit={load} className="w-full max-w-xs flex flex-col gap-4">
          <p className="font-display uppercase tracking-widest text-xs text-white/50 text-center">
            Gestionar conciertos · Staff
          </p>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-950 border-2 border-white/10 focus:border-orange focus:outline-none font-display text-2xl text-center tracking-[0.5em] text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? "…" : "Entrar"}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-4 py-8 bg-background max-w-3xl mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Conciertos
          </h1>
          <Link
            to="/checkin"
            className="font-display uppercase tracking-widest text-[10px] text-white/40 hover:text-orange"
          >
            ← Check-in
          </Link>
        </div>
        {editingId === null && (
          <button
            onClick={startCreate}
            className="px-4 py-2 bg-orange text-black font-display font-bold uppercase tracking-widest text-xs"
          >
            + Añadir
          </button>
        )}
      </div>

      {notice && <p className="text-menta text-sm mb-4">{notice}</p>}

      {editingId !== null && (
        <form
          onSubmit={onSave}
          className="mb-8 p-4 border border-white/10 bg-white/5 flex flex-col gap-3"
        >
          <p className="font-display uppercase tracking-widest text-[10px] text-orange">
            {editingId === "new" ? "Nuevo concierto" : "Editar concierto"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-white/50">
              Ciudad
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-white/50">
              Sala
              <input
                required
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-white/50">
              Fecha (AAAA-MM-DD)
              <input
                required
                placeholder="2026-12-31"
                value={form.show_date}
                onChange={(e) => setForm({ ...form, show_date: e.target.value })}
                className="px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-white/50">
              Hora (HH:MM, opcional)
              <input
                placeholder="20:00"
                value={form.show_time}
                onChange={(e) => setForm({ ...form, show_time: e.target.value })}
                className="px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
            </label>
            <label className="col-span-2 flex flex-col gap-1 text-xs text-white/50">
              Enlace de entradas (opcional)
              <input
                placeholder="https://…"
                value={form.ticket_url}
                onChange={(e) => setForm({ ...form, ticket_url: e.target.value })}
                className="px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
            </label>
            <label className="col-span-2 flex flex-col gap-1 text-xs text-white/50">
              Cartel (ruta ya subida a la web, opcional)
              <input
                placeholder="/mi-cartel.jpg"
                value={form.poster_url}
                onChange={(e) => setForm({ ...form, poster_url: e.target.value })}
                className="px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-white/50">
              <input
                type="checkbox"
                checked={form.sold_out}
                onChange={(e) => setForm({ ...form, sold_out: e.target.checked })}
              />
              Agotado
            </label>
          </div>
          {formError && <p className="text-red-500 text-xs">{formError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-orange text-black font-display font-bold uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-5 py-2 border border-white/20 text-white/60 font-display uppercase tracking-widest text-xs"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <ul className="divide-y divide-white/5 border-y border-white/10">
        {(shows ?? []).map((s) => (
          <li key={s.id} className="flex items-center gap-3 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm">
                {s.show_date}
                {s.show_time ? ` · ${s.show_time}` : ""}
                {s.sold_out && (
                  <span className="ml-2 text-[10px] uppercase tracking-widest text-rojo">
                    Agotado
                  </span>
                )}
              </p>
              <p className="text-white/40 text-xs truncate">
                {s.venue} · {s.city}
                {!s.ticket_url && !s.sold_out && (
                  <span className="ml-2 text-arena/70">Próximamente</span>
                )}
              </p>
            </div>
            <button
              onClick={() => startEdit(s)}
              className="shrink-0 text-[10px] uppercase tracking-widest text-white/40 hover:text-orange"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(s)}
              className="shrink-0 text-[10px] uppercase tracking-widest text-white/30 hover:text-rojo"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {(shows ?? []).length === 0 && (
        <p className="text-center text-white/30 py-12 font-display uppercase tracking-widest text-xs">
          Aún no hay conciertos
        </p>
      )}
    </div>
  );
}
