import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Megaphone, FolderKanban, Wrench, Settings, Plus, Trash2, Save,
  Edit3, ExternalLink, Check, Image as ImageIcon, Upload, ImagePlus,
  ArrowUp, ArrowDown, Newspaper, Pin, Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { uploadImage } from "../../lib/api";
import { useNovidades } from "../../lib/useNovidades";
import { useAvisos, useProjetos, useHeroSlides, useServicos, useSiteMeta } from "../../lib/contentHooks";
import SignedImg from "../SignedImg";

const TABS = [
  { id: "avisos", label: "Avisos", icon: Megaphone },
  { id: "novidades", label: "Novidades", icon: Newspaper },
  { id: "projetos", label: "Projetos", icon: FolderKanban },
  { id: "hero", label: "Hero Slides", icon: ImageIcon },
  { id: "servicos", label: "Serviços", icon: Wrench },
  { id: "site", label: "Site", icon: Settings },
];

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

const DANGEROUS_PROTOS = /^\s*(javascript|vbscript|file|data:(?!image\/)):/i;

function ImageUpload({ value, onChange, label = "Imagem" }) {
  const [uploading, setUploading] = useState(false);

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("Arquivo não é imagem.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      alert("Imagem maior que 10MB.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(f);
      onChange(url);
    } catch (err) {
      if (err.response?.status === 503 && f.size <= 1.5 * 1024 * 1024) {
        onChange(await fileToDataURL(f));
      } else {
        alert(`Falha no upload: ${err.message ?? err}`);
      }
    } finally {
      setUploading(false);
    }
  };
  const onUrlChange = (v) => {
    if (DANGEROUS_PROTOS.test(v)) return;
    onChange(v);
  };
  return (
    <div>
      <span className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">{label}</span>
      <div className="flex gap-2 items-start">
        <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--color-line)] bg-[var(--color-bg)] grid place-items-center shrink-0">
          {value ? <SignedImg src={value} alt="" className="w-full h-full object-cover" /> : <ImagePlus size={20} className="text-[var(--color-text-dim)]" />}
        </div>
        <div className="flex-1 space-y-2">
          <input
            className="w-full min-h-[40px] px-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-amber)] text-sm"
            placeholder="https://... ou faça upload"
            value={value || ""}
            onChange={(e) => onUrlChange(e.target.value)}
          />
          <label className={`inline-flex items-center gap-2 min-h-[36px] px-3 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] text-xs cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <Upload size={14} /> {uploading ? "Enviando..." : "Upload"}
            <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
          </label>
          {value && (
            <button onClick={() => onChange("")} className="ml-2 text-xs text-red-400 hover:underline">Remover</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full min-h-[44px] px-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-amber)] text-sm";

function AvisosTab() {
  const { items, loading, error, create, update, remove } = useAvisos();
  const [draft, setDraft] = useState({ title: "", body: "", level: "info" });

  const onUpdate = async (id, patch) => {
    try { await update(id, patch); } catch (e) { alert(`Falha: ${e.message}`); }
  };
  const onRemove = async (id) => {
    if (!confirm("Remover este aviso?")) return;
    try { await remove(id); } catch (e) { alert(`Falha: ${e.message}`); }
  };
  const add = async () => {
    if (!draft.title.trim()) return;
    try {
      await create({ ...draft, active: true });
      setDraft({ title: "", body: "", level: "info" });
    } catch (e) { alert(`Falha: ${e.response?.data?.error || e.message}`); }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)]">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <Plus size={16} className="text-[var(--color-amber)]" /> Novo aviso
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Título">
            <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </Field>
          <Field label="Mensagem">
            <input className={inputCls} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          </Field>
          <Field label="Tipo">
            <select className={inputCls} value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}>
              <option value="info">Info</option>
              <option value="warning">Aviso</option>
              <option value="success">Sucesso</option>
            </select>
          </Field>
        </div>
        <button onClick={add} className="mt-4 inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)]">
          <Plus size={16} /> Adicionar
        </button>
      </div>
      <div className="space-y-3">
        {loading && <p className="text-[var(--color-text-muted)] text-sm">Carregando...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && items.length === 0 && (
          <p className="text-[var(--color-text-muted)] text-sm">Nenhum aviso cadastrado.</p>
        )}
        {items.map((a) => (
          <div key={a.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)]">
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={a.active} onChange={(e) => onUpdate(a.id, { active: e.target.checked })}
                className="mt-1.5 w-4 h-4 accent-[var(--color-amber)]" aria-label="Ativo" />
              <div className="flex-1 grid sm:grid-cols-3 gap-2">
                <input className={inputCls} value={a.title} onChange={(e) => onUpdate(a.id, { title: e.target.value })} />
                <input className={`${inputCls} sm:col-span-2`} value={a.body || ""} onChange={(e) => onUpdate(a.id, { body: e.target.value })} />
              </div>
              <select value={a.level} onChange={(e) => onUpdate(a.id, { level: e.target.value })} className={`${inputCls} max-w-[120px]`}>
                <option value="info">Info</option>
                <option value="warning">Aviso</option>
                <option value="success">Sucesso</option>
              </select>
              <button onClick={() => onRemove(a.id)} aria-label="Remover"
                className="w-11 h-11 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-red-500 hover:text-red-400 shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const NOVIDADE_TYPES = ["Novidade", "Campanha", "Promoção", "Evento"];

function NovidadesTab() {
  const { items: list, loading, error, create, update, remove: del } = useNovidades();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const blank = () => ({
    id: null,
    type: "Novidade",
    title: "",
    body: "",
    image: "",
    videoUrl: "",
    cta: { label: "", href: "" },
    active: true,
    pinned: false,
    expiresAt: null,
  });

  const save = async (item) => {
    setSaving(true);
    try {
      if (item.id) await update(item.id, item);
      else await create(item);
      setEditing(null);
    } catch (e) {
      alert(`Falha ao salvar: ${e.response?.data?.error || e.message}`);
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id) => {
    if (!confirm("Remover esta novidade?")) return;
    try { await del(id); } catch (e) { alert(`Falha: ${e.message}`); }
  };
  const toggle = async (item, patch) => {
    try { await update(item.id, { ...item, ...patch }); } catch (e) { alert(`Falha: ${e.message}`); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          {loading ? "Carregando..." : `${list.length} itens`}
          {error && <span className="text-red-400 ml-2">{error}</span>}
        </p>
        <button onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)]">
          <Plus size={16} /> Nova novidade
        </button>
      </div>

      {editing && (
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-amber)]/40">
          <h3 className="font-display font-semibold text-lg mb-4">
            {list.find((n) => n.id === editing.id) ? "Editar" : "Nova"} novidade
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Tipo">
              <select className={inputCls} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
                {NOVIDADE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Expira em (opcional)">
              <input type="date" className={inputCls}
                value={editing.expiresAt ? new Date(editing.expiresAt).toISOString().slice(0,10) : ""}
                onChange={(e) => setEditing({ ...editing, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
            </Field>
            <Field label="Título">
              <input className={`${inputCls} sm:col-span-2`} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Mensagem / descrição">
                <textarea rows={3} className={`${inputCls} py-3`} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <ImageUpload value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} label="Imagem (opcional)" />
            </div>
            <Field label="Vídeo URL (YouTube/Vimeo/MP4)">
              <input className={`${inputCls} sm:col-span-2`} placeholder="https://youtube.com/watch?v=..."
                value={editing.videoUrl || ""} onChange={(e) => setEditing({ ...editing, videoUrl: e.target.value })} />
            </Field>
            <Field label="CTA texto">
              <input className={inputCls} placeholder="Saiba mais" value={editing.cta?.label || ""}
                onChange={(e) => setEditing({ ...editing, cta: { ...editing.cta, label: e.target.value } })} />
            </Field>
            <Field label="CTA link">
              <input className={inputCls} placeholder="#contato ou https://..." value={editing.cta?.href || ""}
                onChange={(e) => setEditing({ ...editing, cta: { ...editing.cta, href: e.target.value } })} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.pinned} onChange={(e) => setEditing({ ...editing, pinned: e.target.checked })}
                className="w-4 h-4 accent-[var(--color-amber)]" /> Fixar no topo
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                className="w-4 h-4 accent-[var(--color-amber)]" /> Ativo
            </label>
          </div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => save(editing)} disabled={saving}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)] disabled:opacity-50">
              <Save size={16} /> {saving ? "Salvando..." : "Salvar"}
            </button>
            <button onClick={() => setEditing(null)}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)]">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {!loading && list.length === 0 && <p className="text-[var(--color-text-muted)] text-sm">Nenhuma novidade cadastrada.</p>}
        {list.map((n) => (
          <div key={n.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] flex items-start gap-3">
            <input type="checkbox" checked={n.active} onChange={(e) => toggle(n, { active: e.target.checked })}
              className="mt-1.5 w-4 h-4 accent-[var(--color-amber)]" aria-label="Ativo" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--color-line)]">{n.type}</span>
                {n.pinned && <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--color-amber)]"><Pin size={10}/> Fixado</span>}
                {n.videoUrl && <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--color-text-dim)]"><Video size={10}/> vídeo</span>}
              </div>
              <p className="font-semibold text-sm truncate">{n.title || "(sem título)"}</p>
              <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">{n.body}</p>
            </div>
            <button onClick={() => toggle(n, { pinned: !n.pinned })} aria-label="Fixar"
              className={`w-11 h-11 grid place-items-center rounded-lg border ${n.pinned ? "border-[var(--color-amber)] text-[var(--color-amber)]" : "border-[var(--color-line)]"} hover:border-[var(--color-amber)] shrink-0`}>
              <Pin size={16} />
            </button>
            <button onClick={() => setEditing(n)} aria-label="Editar"
              className="w-11 h-11 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] shrink-0">
              <Edit3 size={16} />
            </button>
            <button onClick={() => remove(n.id)} aria-label="Remover"
              className="w-11 h-11 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-red-500 hover:text-red-400 shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjetosTab() {
  const { items, loading, error, create, update, remove: del } = useProjetos();
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const blank = () => ({
    id: null, client: "", sector: "", type: "Projeto",
    title: "", outcome: "", metric: "", image: "", year: new Date().getFullYear(), sort_order: 0,
  });

  const save = async (proj) => {
    setSaving(true);
    try {
      if (proj.id) await update(proj.id, proj);
      else await create(proj);
      setEditing(null);
    } catch (e) { alert(`Falha: ${e.response?.data?.error || e.message}`); }
    finally { setSaving(false); }
  };
  const remove = async (id) => {
    if (!confirm("Remover este projeto?")) return;
    try { await del(id); } catch (e) { alert(`Falha: ${e.message}`); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          {loading ? "Carregando..." : `${items.length} projetos`}
          {error && <span className="text-red-400 ml-2">{error}</span>}
        </p>
        <button onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)]">
          <Plus size={16} /> Novo projeto
        </button>
      </div>
      {editing && (
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-amber)]/40">
          <h3 className="font-display font-semibold text-lg mb-4">
            {editing.id ? "Editar" : "Novo"} projeto
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Cliente"><input className={inputCls} value={editing.client} onChange={(e) => setEditing({ ...editing, client: e.target.value })} /></Field>
            <Field label="Setor"><input className={inputCls} value={editing.sector} onChange={(e) => setEditing({ ...editing, sector: e.target.value })} /></Field>
            <Field label="Tipo">
              <select className={inputCls} value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
                <option>Projeto</option><option>Laudo</option><option>Automação</option><option>Consultoria</option><option>Manutenção</option>
              </select>
            </Field>
            <Field label="Ano"><input type="number" className={inputCls} value={editing.year} onChange={(e) => setEditing({ ...editing, year: +e.target.value })} /></Field>
            <Field label="Título"><input className={`${inputCls} sm:col-span-2`} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <div className="sm:col-span-2">
              <Field label="Resultado / descrição">
                <textarea rows={3} className={`${inputCls} py-3`} value={editing.outcome} onChange={(e) => setEditing({ ...editing, outcome: e.target.value })} />
              </Field>
            </div>
            <Field label="Métrica destaque"><input className={inputCls} value={editing.metric} onChange={(e) => setEditing({ ...editing, metric: e.target.value })} /></Field>
            <div><ImageUpload value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} label="Imagem do projeto" /></div>
          </div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => save(editing)} disabled={saving} className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold disabled:opacity-50">
              <Save size={16} /> {saving ? "Salvando..." : "Salvar"}
            </button>
            <button onClick={() => setEditing(null)} className="min-h-[44px] px-5 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)]">
              Cancelar
            </button>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((p) => (
          <div key={p.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-amber)]/10 text-[var(--color-amber)]">{p.type}</span>
              <div className="flex gap-1">
                <button onClick={() => setEditing(p)} aria-label="Editar" className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)]"><Edit3 size={14} /></button>
                <button onClick={() => remove(p.id)} aria-label="Remover" className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-red-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="font-mono text-xs text-[var(--color-text-dim)] mb-1">{p.client} · {p.sector} · {p.year}</div>
            <div className="font-display font-semibold leading-tight mb-1">{p.title}</div>
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{p.outcome}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroTab() {
  const { items: slides, loading, error, create, update, remove: del } = useHeroSlides();

  const onUpdate = async (id, patch) => {
    const cur = slides.find((s) => s.id === id);
    try { await update(id, { ...cur, ...patch }); } catch (e) { alert(`Falha: ${e.message}`); }
  };
  const onRemove = async (id) => { if (confirm("Remover slide?")) { try { await del(id); } catch (e) { alert(`Falha: ${e.message}`); } } };
  const add = async () => {
    try { await create({ caption: "Novo slide", image: "", sort_order: slides.length }); } catch (e) { alert(`Falha: ${e.response?.data?.error || e.message}`); }
  };
  const move = async (id, dir) => {
    const idx = slides.findIndex((s) => s.id === id);
    const j = idx + dir;
    if (j < 0 || j >= slides.length) return;
    const a = slides[idx], b = slides[j];
    try {
      await update(a.id, { ...a, sort_order: b.sort_order });
      await update(b.id, { ...b, sort_order: a.sort_order });
    } catch (e) { alert(`Falha: ${e.message}`); }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          {loading ? "Carregando..." : `${slides.length} slides`}
          {error && <span className="text-red-400 ml-2">{error}</span>}
        </p>
        <button onClick={add} className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)]">
          <Plus size={16} /> Novo slide
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {slides.map((s, i) => (
          <div key={s.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--color-text-dim)]">Slide {i + 1}</span>
              <div className="flex gap-2">
                <button onClick={() => move(s.id, -1)} disabled={i === 0} aria-label="Subir"
                  className="w-9 h-9 grid place-items-center rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-amber)] disabled:opacity-30"><ArrowUp size={16} /></button>
                <button onClick={() => move(s.id, 1)} disabled={i === slides.length - 1} aria-label="Descer"
                  className="w-9 h-9 grid place-items-center rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-amber)] disabled:opacity-30"><ArrowDown size={16} /></button>
                <button onClick={() => onRemove(s.id)} aria-label="Remover"
                  className="ml-2 w-9 h-9 grid place-items-center rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-red-500 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            <ImageUpload value={s.image} onChange={(v) => onUpdate(s.id, { image: v })} />
            <Field label="Legenda">
              <input className={inputCls} value={s.caption} onChange={(e) => onUpdate(s.id, { caption: e.target.value })} />
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}

const ICON_KEYS = ["zap", "clipboard", "cpu", "gauge", "ruler", "sun", "wrench", "shield", "bulb", "cable", "settings", "activity"];

function ServicosTab() {
  const { items, loading, error, create, update, remove: del } = useServicos();

  const onUpdate = async (id, patch) => {
    const cur = items.find((s) => s.id === id);
    try { await update(id, { ...cur, ...patch }); } catch (e) { alert(`Falha: ${e.message}`); }
  };
  const onRemove = async (id) => { if (!confirm("Remover este serviço?")) return; try { await del(id); } catch (e) { alert(`Falha: ${e.message}`); } };
  const add = async () => {
    try { await create({ title: "Novo serviço", desc: "Resumo curto.", detail: "Descrição detalhada.", iconKey: "zap", sort_order: items.length }); } catch (e) { alert(`Falha: ${e.response?.data?.error || e.message}`); }
  };
  const move = async (id, dir) => {
    const idx = items.findIndex((s) => s.id === id);
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[idx], b = items[j];
    try {
      await update(a.id, { ...a, sort_order: b.sort_order });
      await update(b.id, { ...b, sort_order: a.sort_order });
    } catch (e) { alert(`Falha: ${e.message}`); }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          {loading ? "Carregando..." : `${items.length} serviços`}
          {error && <span className="text-red-400 ml-2">{error}</span>}
        </p>
        <button onClick={add} className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)]">
          <Plus size={16} /> Novo serviço
        </button>
      </div>
      <div className="space-y-3">
        {items.map((s, i) => (
          <div key={s.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-[var(--color-text-dim)]">#{i + 1}</span>
              <div className="flex gap-1">
                <button onClick={() => move(s.id, -1)} disabled={i === 0} aria-label="Subir" className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] disabled:opacity-30"><ArrowUp size={14} /></button>
                <button onClick={() => move(s.id, 1)} disabled={i === items.length - 1} aria-label="Descer" className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] disabled:opacity-30"><ArrowDown size={14} /></button>
                <button onClick={() => onRemove(s.id)} aria-label="Remover" className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-red-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Título"><input className={inputCls} value={s.title} onChange={(e) => onUpdate(s.id, { title: e.target.value })} /></Field>
              <Field label="Ícone">
                <select className={inputCls} value={s.iconKey || "zap"} onChange={(e) => onUpdate(s.id, { iconKey: e.target.value })}>
                  {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </Field>
              <Field label="Resumo"><input className={inputCls} value={s.desc || ""} onChange={(e) => onUpdate(s.id, { desc: e.target.value })} /></Field>
            </div>
            <Field label="Detalhe"><textarea rows={2} className={`${inputCls} py-3`} value={s.detail || ""} onChange={(e) => onUpdate(s.id, { detail: e.target.value })} /></Field>
          </div>
        ))}
      </div>
    </div>
  );
}

function SiteTab() {
  const { data, loading, error, save } = useSiteMeta();
  const update = async (patch) => {
    try { await save({ ...(data || {}), ...patch }); } catch (e) { alert(`Falha: ${e.message}`); }
  };
  if (loading) return <p className="text-sm text-[var(--color-text-muted)]">Carregando...</p>;
  if (error) return <p className="text-red-400 text-sm">{error}</p>;
  const site = data || {};
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] grid gap-3">
        <Field label="Badge superior do hero">
          <input className={inputCls} value={site.heroBadge || ""} onChange={(e) => update({ heroBadge: e.target.value })} />
        </Field>
        <Field label="Título do hero">
          <input className={inputCls} value={site.heroTitle || ""} onChange={(e) => update({ heroTitle: e.target.value })} />
        </Field>
        <Field label="Subtítulo do hero">
          <textarea rows={3} className={`${inputCls} py-3`} value={site.heroSubtitle || ""} onChange={(e) => update({ heroSubtitle: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}

function Painel() {
  const [tab, setTab] = useState("avisos");
  const [toast, setToast] = useState({ visible: false, msg: "" });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post("/api/auth/logout"); } catch { /* ignora */ }
    navigate("/");
  };

  useEffect(() => {
    let timeout;
    const handler = () => {
      setToast({ visible: true, msg: "Alterações salvas" });
      clearTimeout(timeout);
      timeout = setTimeout(() => setToast({ visible: false, msg: "" }), 3000);
    };
    window.addEventListener("insight:store", handler);
    return () => {
      window.removeEventListener("insight:store", handler);
      clearTimeout(timeout);
    };
  }, []);

  const counts = {};

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-30 backdrop-blur bg-[var(--color-bg)]/80 border-b border-[var(--color-line)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-amber)] grid place-items-center text-black font-bold">i</div>
            <div>
              <h1 className="font-display font-bold text-lg leading-none">Painel Insight</h1>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mt-1">admin · v2</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 min-h-[40px] px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] text-sm transition-colors">
              <ExternalLink size={14} /> Ver site
            </a>
            <button onClick={handleLogout}
              className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] text-sm transition-colors">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-[5.5rem] z-10">
          <nav role="tablist" className="flex flex-row lg:flex-col flex-wrap gap-2 lg:gap-1 p-2 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)]">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} role="tab" aria-selected={active} onClick={() => setTab(t.id)}
                  className={`flex-1 sm:flex-none lg:w-full inline-flex items-center lg:justify-start justify-center gap-3 min-h-[44px] px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    active ? "bg-[var(--color-amber)] text-black" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5"
                  }`}>
                  <Icon size={16} className={active ? "text-black" : "text-[var(--color-text-dim)]"} />
                  <span className="hidden sm:inline lg:inline">{t.label}</span>
                  {counts[t.id] > 0 && (
                    <span className={`ml-auto font-mono text-[10px] px-2 py-0.5 rounded-full ${active ? "bg-black/20" : "bg-[var(--color-line)]"}`}>
                      {counts[t.id]}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="hidden lg:flex mt-6 items-center justify-center gap-1.5 text-xs text-[var(--color-text-dim)] font-mono">
            <Check size={14} className="text-emerald-400" /> Auto-save ativo
          </div>
        </aside>

        <main className="flex-1 min-w-0 w-full">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {tab === "avisos" && <AvisosTab />}
            {tab === "novidades" && <NovidadesTab />}
            {tab === "projetos" && <ProjetosTab />}
            {tab === "hero" && <HeroTab />}
            {tab === "servicos" && <ServicosTab />}
            {tab === "site" && <SiteTab />}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-amber)]/40 text-[var(--color-text)] shadow-[var(--shadow-elevated)]"
          >
            <CheckCircle2 size={20} className="text-[var(--color-amber)]" />
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Painel;
