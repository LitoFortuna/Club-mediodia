import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listShowsAdmin,
  createShow,
  updateShow,
  deleteShow,
} from "@/api/shows-admin.functions";
import { getSiteContentAdmin, updateSiteContent } from "@/api/content.functions";
import type { Show, SiteContent } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Club Mediodía" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "shows" | "content";

function AdminPage() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("shows");

  const listAdmin = useServerFn(getSiteContentAdmin);

  const load = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!pin.trim()) return;
    setLoading(true);
    setError("");
    try {
      // Se reutiliza como comprobación de PIN: si el gate rechaza, no desbloqueamos.
      const res = await listAdmin({ data: { pin } });
      if (!res.ok) {
        setError(res.message || "PIN incorrecto.");
      } else {
        setUnlocked(true);
      }
    } catch {
      setError("No se pudo comprobar el PIN.");
    } finally {
      setLoading(false);
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background">
        <form onSubmit={load} className="w-full max-w-xs flex flex-col gap-4">
          <p className="font-display uppercase tracking-widest text-xs text-white/50 text-center">
            Panel de administración
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
            Admin
          </h1>
          <Link
            to="/checkin"
            className="font-display uppercase tracking-widest text-[10px] text-white/40 hover:text-orange"
          >
            ← Check-in
          </Link>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("shows")}
            className={`px-4 py-2 font-display uppercase tracking-widest text-[10px] border ${
              tab === "shows" ? "bg-orange text-black border-orange" : "border-white/20 text-white/50"
            }`}
          >
            Conciertos
          </button>
          <button
            onClick={() => setTab("content")}
            className={`px-4 py-2 font-display uppercase tracking-widest text-[10px] border ${
              tab === "content" ? "bg-orange text-black border-orange" : "border-white/20 text-white/50"
            }`}
          >
            Contenido
          </button>
        </div>
      </div>

      {tab === "shows" ? <ShowsTab pin={pin} /> : <ContentTab pin={pin} />}
    </div>
  );
}

/* ============================= CONCIERTOS ============================= */

type ShowFormState = {
  city: string;
  venue: string;
  show_date: string;
  show_time: string;
  sold_out: boolean;
  ticket_url: string;
  poster_url: string;
};

const EMPTY_SHOW_FORM: ShowFormState = {
  city: "",
  venue: "",
  show_date: "",
  show_time: "",
  sold_out: false,
  ticket_url: "",
  poster_url: "",
};

function showToForm(s: Show): ShowFormState {
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

function ShowsTab({ pin }: { pin: string }) {
  const list = useServerFn(listShowsAdmin);
  const create = useServerFn(createShow);
  const update = useServerFn(updateShow);
  const del = useServerFn(deleteShow);

  const [shows, setShows] = useState<Show[] | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ShowFormState>(EMPTY_SHOW_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const refresh = async () => {
    const res = await list({ data: { pin } });
    if (res.ok) setShows(res.shows);
    setLoaded(true);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) {
    return <p className="text-white/40 text-sm">Cargando…</p>;
  }

  const startCreate = () => {
    setEditingId("new");
    setForm(EMPTY_SHOW_FORM);
    setFormError("");
  };

  const startEdit = (s: Show) => {
    setEditingId(s.id);
    setForm(showToForm(s));
    setFormError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_SHOW_FORM);
    setFormError("");
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setNotice("");
    try {
      const fields = { ...form };
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

  return (
    <div>
      {editingId === null && (
        <button
          onClick={startCreate}
          className="mb-4 px-4 py-2 bg-orange text-black font-display font-bold uppercase tracking-widest text-xs"
        >
          + Añadir
        </button>
      )}

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

/* ============================== CONTENIDO ============================== */

function ContentTab({ pin }: { pin: string }) {
  const getContent = useServerFn(getSiteContentAdmin);
  const save = useServerFn(updateSiteContent);

  const [content, setContent] = useState<SiteContent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const refresh = async () => {
    const res = await getContent({ data: { pin } });
    if (res.ok && res.content) setContent(res.content);
    setLoaded(true);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) {
    return <p className="text-white/40 text-sm">Cargando…</p>;
  }
  if (!content) return <p className="text-red-500 text-sm">No se pudo cargar el contenido.</p>;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await save({
        data: {
          pin,
          fields: {
            bio_corta: content.bio_corta,
            bio_larga: content.bio_larga,
            members: content.members,
            streaming_links: content.streaming_links,
            youtube_video_url: content.youtube_video_url,
          },
        },
      });
      if (!res.ok) setError(res.message);
      else setNotice(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Datos inválidos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSave} className="flex flex-col gap-8">
      {notice && <p className="text-menta text-sm">{notice}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Bio corta */}
      <label className="flex flex-col gap-1 text-xs text-white/50">
        Biografía corta (portada de /prensa)
        <textarea
          rows={3}
          value={content.bio_corta}
          onChange={(e) => setContent({ ...content, bio_corta: e.target.value })}
          className="px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
        />
      </label>

      {/* Bio larga */}
      <div>
        <p className="text-xs text-white/50 mb-2">Biografía larga (un párrafo por bloque)</p>
        <div className="flex flex-col gap-2">
          {content.bio_larga.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                rows={3}
                value={p}
                onChange={(e) => {
                  const next = [...content.bio_larga];
                  next[i] = e.target.value;
                  setContent({ ...content, bio_larga: next });
                }}
                className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setContent({ ...content, bio_larga: content.bio_larga.filter((_, j) => j !== i) })
                }
                className="shrink-0 text-[10px] uppercase tracking-widest text-white/30 hover:text-rojo"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setContent({ ...content, bio_larga: [...content.bio_larga, ""] })}
          className="mt-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-orange"
        >
          + Añadir párrafo
        </button>
      </div>

      {/* Miembros */}
      <div>
        <p className="text-xs text-white/50 mb-2">Miembros de la banda</p>
        <div className="flex flex-col gap-2">
          {content.members.map((m, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Nombre"
                value={m.name}
                onChange={(e) => {
                  const next = [...content.members];
                  next[i] = { ...next[i], name: e.target.value };
                  setContent({ ...content, members: next });
                }}
                className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
              <input
                placeholder="Rol"
                value={m.role}
                onChange={(e) => {
                  const next = [...content.members];
                  next[i] = { ...next[i], role: e.target.value };
                  setContent({ ...content, members: next });
                }}
                className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setContent({ ...content, members: content.members.filter((_, j) => j !== i) })
                }
                className="shrink-0 text-[10px] uppercase tracking-widest text-white/30 hover:text-rojo"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setContent({ ...content, members: [...content.members, { name: "", role: "" }] })
          }
          className="mt-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-orange"
        >
          + Añadir miembro
        </button>
      </div>

      {/* Streaming links */}
      <div>
        <p className="text-xs text-white/50 mb-2">Enlaces de plataformas (botones en /musica)</p>
        <div className="flex flex-col gap-2">
          {content.streaming_links.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Nombre"
                value={s.label}
                onChange={(e) => {
                  const next = [...content.streaming_links];
                  next[i] = { ...next[i], label: e.target.value };
                  setContent({ ...content, streaming_links: next });
                }}
                className="w-40 px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
              <input
                placeholder="https://…"
                value={s.url}
                onChange={(e) => {
                  const next = [...content.streaming_links];
                  next[i] = { ...next[i], url: e.target.value };
                  setContent({ ...content, streaming_links: next });
                }}
                className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setContent({
                    ...content,
                    streaming_links: content.streaming_links.filter((_, j) => j !== i),
                  })
                }
                className="shrink-0 text-[10px] uppercase tracking-widest text-white/30 hover:text-rojo"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setContent({
              ...content,
              streaming_links: [...content.streaming_links, { label: "", url: "" }],
            })
          }
          className="mt-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-orange"
        >
          + Añadir plataforma
        </button>
      </div>

      {/* YouTube */}
      <label className="flex flex-col gap-1 text-xs text-white/50">
        Vídeo de YouTube embebido en /musica
        <input
          placeholder="https://youtu.be/…"
          value={content.youtube_video_url}
          onChange={(e) => setContent({ ...content, youtube_video_url: e.target.value })}
          className="px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="self-start px-6 py-3 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm disabled:opacity-50"
      >
        {saving ? "Guardando…" : "Guardar contenido"}
      </button>
    </form>
  );
}
