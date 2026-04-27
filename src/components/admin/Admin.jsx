import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, LogOut, Megaphone, FolderKanban, Wrench, Settings, Plus, Trash2, Save,
  RotateCcw, Edit3, ExternalLink, Check, Image as ImageIcon, Upload, ImagePlus, CheckCircle2, ArrowUp, ArrowDown
} from "lucide-react";
import { store, useStore, uid } from "../../lib/store";

const TABS = [
  { id: "avisos", label: "Avisos", icon: Megaphone },
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

function ImageUpload({ value, onChange, label = "Imagem" }) {
  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 1.5 * 1024 * 1024) {
      alert("Imagem muito grande (máx 1.5MB). Use URL ou redimensione.");
      return;
    }
    onChange(await fileToDataURL(f));
  };
  return (
    <div>
      <span className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">{label}</span>
      <div className="flex gap-2 items-start">
        <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--color-line)] bg-[var(--color-bg)] grid place-items-center shrink-0">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <ImagePlus size={20} className="text-[var(--color-text-dim)]" />}
        </div>
        <div className="flex-1 space-y-2">
          <input
            className="w-full min-h-[40px] px-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-amber)] text-sm"
            placeholder="https://... ou faça upload"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <label className="inline-flex items-center gap-2 min-h-[36px] px-3 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] text-xs cursor-pointer">
            <Upload size={14} /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
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
  const state = useStore();
  const [draft, setDraft] = useState({ title: "", body: "", level: "info" });

  const update = (id, patch) => {
    const next = { ...state, announcements: state.announcements.map((a) => a.id === id ? { ...a, ...patch } : a) };
    store.set(next);
  };
  const remove = (id) => {
    if (!confirm("Remover este aviso?")) return;
    store.set({ ...state, announcements: state.announcements.filter((a) => a.id !== id) });
  };
  const add = () => {
    if (!draft.title.trim()) return;
    store.set({
      ...state,
      announcements: [
        { id: uid(), ...draft, active: true, createdAt: Date.now() },
        ...state.announcements,
      ],
    });
    setDraft({ title: "", body: "", level: "info" });
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
        <button
          onClick={add}
          className="mt-4 inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)]"
        >
          <Plus size={16} /> Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {state.announcements.length === 0 && (
          <p className="text-[var(--color-text-muted)] text-sm">Nenhum aviso cadastrado.</p>
        )}
        {state.announcements.map((a) => (
          <div key={a.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)]">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={a.active}
                onChange={(e) => update(a.id, { active: e.target.checked })}
                className="mt-1.5 w-4 h-4 accent-[var(--color-amber)]"
                aria-label="Ativo"
              />
              <div className="flex-1 grid sm:grid-cols-3 gap-2">
                <input className={inputCls} value={a.title} onChange={(e) => update(a.id, { title: e.target.value })} />
                <input className={`${inputCls} sm:col-span-2`} value={a.body} onChange={(e) => update(a.id, { body: e.target.value })} />
              </div>
              <select
                value={a.level}
                onChange={(e) => update(a.id, { level: e.target.value })}
                className={`${inputCls} max-w-[120px]`}
              >
                <option value="info">Info</option>
                <option value="warning">Aviso</option>
                <option value="success">Sucesso</option>
              </select>
              <button
                onClick={() => remove(a.id)}
                aria-label="Remover"
                className="w-11 h-11 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-red-500 hover:text-red-400 shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjetosTab() {
  const state = useStore();
  const [editing, setEditing] = useState(null);

  const blank = () => ({
    id: uid(), client: "", sector: "", type: "Projeto",
    title: "", outcome: "", metric: "", image: "", year: new Date().getFullYear(),
  });

  const save = (proj) => {
    const exists = state.projects.find((p) => p.id === proj.id);
    const next = exists
      ? state.projects.map((p) => (p.id === proj.id ? proj : p))
      : [proj, ...state.projects];
    store.set({ ...state, projects: next });
    setEditing(null);
  };
  const remove = (id) => {
    if (!confirm("Remover este projeto?")) return;
    store.set({ ...state, projects: state.projects.filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">{state.projects.length} projetos</p>
        <button
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)]"
        >
          <Plus size={16} /> Novo projeto
        </button>
      </div>

      {editing && (
        <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-amber)]/40">
          <h3 className="font-display font-semibold text-lg mb-4">
            {state.projects.find((p) => p.id === editing.id) ? "Editar" : "Novo"} projeto
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
            <button onClick={() => save(editing)} className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold">
              <Save size={16} /> Salvar
            </button>
            <button onClick={() => setEditing(null)} className="min-h-[44px] px-5 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)]">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {state.projects.map((p) => (
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
  const state = useStore();
  const slides = state.heroSlides || [];
  const update = (id, patch) => store.set({ ...state, heroSlides: slides.map((s) => s.id === id ? { ...s, ...patch } : s) });
  const remove = (id) => { if (confirm("Remover slide?")) store.set({ ...state, heroSlides: slides.filter((s) => s.id !== id) }); };
  const add = () => store.set({ ...state, heroSlides: [...slides, { id: uid(), caption: "Novo slide", image: "" }] });
  const move = (id, dir) => {
    const idx = slides.findIndex((s) => s.id === id);
    const j = idx + dir;
    if (j < 0 || j >= slides.length) return;
    const next = [...slides];
    [next[idx], next[j]] = [next[j], next[idx]];
    store.set({ ...state, heroSlides: next });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">{slides.length} slides · exibidos no carrossel da hero</p>
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
                <button onClick={() => move(s.id, -1)} disabled={i === 0} aria-label="Mover para cima" className="w-9 h-9 grid place-items-center rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] disabled:opacity-30 transition-colors"><ArrowUp size={16} /></button>
                <button onClick={() => move(s.id, 1)} disabled={i === slides.length - 1} aria-label="Mover para baixo" className="w-9 h-9 grid place-items-center rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] disabled:opacity-30 transition-colors"><ArrowDown size={16} /></button>
                <button onClick={() => remove(s.id)} aria-label="Remover" className="ml-2 w-9 h-9 grid place-items-center rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-red-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <ImageUpload value={s.image} onChange={(v) => update(s.id, { image: v })} />
            <Field label="Legenda">
              <input className={inputCls} value={s.caption} onChange={(e) => update(s.id, { caption: e.target.value })} />
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}

const ICON_KEYS = [
  "zap", "clipboard", "cpu", "gauge", "ruler", "sun",
  "wrench", "shield", "bulb", "cable", "settings", "activity",
];

function ServicosTab() {
  const state = useStore();
  const update = (id, patch) => {
    store.set({
      ...state,
      services: state.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  };
  const remove = (id) => {
    if (!confirm("Remover este serviço?")) return;
    store.set({ ...state, services: state.services.filter((s) => s.id !== id) });
  };
  const add = () => {
    store.set({
      ...state,
      services: [
        ...state.services,
        { id: uid(), title: "Novo serviço", desc: "Resumo curto.", detail: "Descrição detalhada.", iconKey: "zap" },
      ],
    });
  };
  const move = (id, dir) => {
    const idx = state.services.findIndex((s) => s.id === id);
    const j = idx + dir;
    if (j < 0 || j >= state.services.length) return;
    const next = [...state.services];
    [next[idx], next[j]] = [next[j], next[idx]];
    store.set({ ...state, services: next });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">{state.services.length} serviços</p>
        <button onClick={add} className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)]">
          <Plus size={16} /> Novo serviço
        </button>
      </div>
      <div className="space-y-3">
        {state.services.map((s, i) => (
          <div key={s.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-[var(--color-text-dim)]">#{i + 1}</span>
              <div className="flex gap-1">
                <button onClick={() => move(s.id, -1)} disabled={i === 0} aria-label="Subir" className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] disabled:opacity-30"><ArrowUp size={14} /></button>
                <button onClick={() => move(s.id, 1)} disabled={i === state.services.length - 1} aria-label="Descer" className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] disabled:opacity-30"><ArrowDown size={14} /></button>
                <button onClick={() => remove(s.id)} aria-label="Remover" className="w-9 h-9 grid place-items-center rounded-lg border border-[var(--color-line)] hover:border-red-500 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Título"><input className={inputCls} value={s.title} onChange={(e) => update(s.id, { title: e.target.value })} /></Field>
              <Field label="Ícone">
                <select className={inputCls} value={s.iconKey || "zap"} onChange={(e) => update(s.id, { iconKey: e.target.value })}>
                  {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </Field>
              <Field label="Resumo"><input className={inputCls} value={s.desc} onChange={(e) => update(s.id, { desc: e.target.value })} /></Field>
            </div>
            <Field label="Detalhe"><textarea rows={2} className={`${inputCls} py-3`} value={s.detail} onChange={(e) => update(s.id, { detail: e.target.value })} /></Field>
          </div>
        ))}
      </div>
    </div>
  );
}

function SiteTab() {
  const state = useStore();
  const update = (patch) => store.set({ ...state, site: { ...state.site, ...patch } });
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] grid gap-3">
        <Field label="Badge superior do hero">
          <input className={inputCls} value={state.site.heroBadge} onChange={(e) => update({ heroBadge: e.target.value })} />
        </Field>
        <Field label="Título do hero">
          <input className={inputCls} value={state.site.heroTitle} onChange={(e) => update({ heroTitle: e.target.value })} />
        </Field>
        <Field label="Subtítulo do hero">
          <textarea rows={3} className={`${inputCls} py-3`} value={state.site.heroSubtitle} onChange={(e) => update({ heroSubtitle: e.target.value })} />
        </Field>
      </div>

      <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/30">
        <h3 className="font-display font-semibold mb-2">Resetar conteúdo</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-3">Restaura todos os dados (avisos, projetos, serviços, hero) ao padrão.</p>
        <button
          onClick={() => { if (confirm("Resetar todo o conteúdo?")) store.reset(); }}
          className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10"
        >
          <RotateCcw size={16} /> Resetar tudo
        </button>
      </div>
    </div>
  );
}

function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("insight_admin") === "1");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("avisos");
  const state = useStore();

  const submit = (e) => {
    e.preventDefault();
    const expected = import.meta.env.VITE_ADMIN_PASS || "insight2017";
    if (pwd === expected) {
      sessionStorage.setItem("insight_admin", "1");
      setAuthed(true); setErr("");
    } else setErr("Senha incorreta.");
  };

  if (!authed) {
    return (
      <div className="min-h-screen grid place-items-center px-5 bg-[var(--color-bg)]">
        <form onSubmit={submit} className="w-full max-w-sm p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)]">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/30 flex items-center justify-center mb-5">
            <Lock size={20} className="text-[var(--color-amber)]" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-1">Área restrita</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">Painel administrativo Insight</p>
          <input type="password" placeholder="Senha" value={pwd} onChange={(e) => setPwd(e.target.value)} autoFocus
            className="w-full min-h-[48px] px-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-amber)] mb-3" />
          <button type="submit" className="w-full min-h-[48px] rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)] transition-colors">
            Entrar
          </button>
          {err && <p className="mt-3 text-sm text-red-400" role="alert">{err}</p>}
        </form>
      </div>
    );
  }

  const counts = {
    avisos: state.announcements.filter((a) => a.active).length,
    projetos: state.projects.length,
    hero: (state.heroSlides || []).length,
    servicos: state.services.length,
    site: 0,
  };

  const [toast, setToast] = useState({ visible: false, msg: "" });

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

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-30 backdrop-blur bg-[var(--color-bg)]/80 border-b border-[var(--color-line)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-amber)] grid place-items-center text-black font-bold">i</div>
            <div>
              <h1 className="font-display font-bold text-lg leading-none">Painel Insight</h1>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mt-1">admin · v1</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-2 min-h-[40px] px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] text-sm transition-colors">
              <ExternalLink size={14} /> Ver site
            </a>
            <button
              onClick={() => { sessionStorage.removeItem("insight_admin"); setAuthed(false); }}
              className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] text-sm transition-colors"
            >
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
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 sm:flex-none lg:w-full inline-flex items-center lg:justify-start justify-center gap-3 min-h-[44px] px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    active ? "bg-[var(--color-amber)] text-black" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5"
                  }`}
                >
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
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "avisos" && <AvisosTab />}
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

export default Admin;
