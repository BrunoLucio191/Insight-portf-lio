// ============================================================================
// MensagensTab — aba "Mensagens" do painel admin
// ----------------------------------------------------------------------------
// O que faz:
//   - Mostra cards de stats (Total / Novas / Respondidas / Hoje).
//   - Filtros: busca textual, status (todas/novas/respondidas), serviço,
//     intervalo de datas (De / Até).
//   - Lista colapsável: clique no card → expande o detalhe completo.
//   - Permite responder (grava no banco), abrir email/WhatsApp pré-preenchido
//     e remover a mensagem.
//
// Onde alterar coisas comuns:
//   - Lista de serviços do filtro:  vem de `SERVICES` em `lib/data.js` +
//     serviços já existentes no banco (união, sem duplicar).
//   - Layout dos cards/status:      veja StatusBadge / StatCard abaixo.
//   - Endpoint API:                 `mensagensApi` em `lib/api.js`.
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import {
  Mail, MessageCircle, Trash2, Send, CheckCircle2, Search, Filter,
  Inbox, Clock, X, ChevronDown, RefreshCw, Calendar, User, Building2, Wrench,
} from "lucide-react";
import { mensagensApi } from "../../lib/api";
import { SERVICES } from "../../lib/data";

const inputCls =
  "w-full min-h-[40px] px-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-amber)] text-sm";

// Helpers de data/exibição — mantém o JSX limpo
function fmtDate(ts) {
  if (!ts) return "";
  try { return new Date(ts).toLocaleDateString("pt-BR"); } catch { return ts; }
}
function fmtDateTime(ts) {
  if (!ts) return "";
  try { return new Date(ts).toLocaleString("pt-BR"); } catch { return ts; }
}
function relTime(ts) {
  if (!ts) return "";
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return fmtDate(ts);
}
function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

function StatusBadge({ status }) {
  const respondido = status === "respondido";
  return (
    <span
      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded inline-flex items-center gap-1 ${
        respondido
          ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
          : "bg-[var(--color-amber)]/15 text-[var(--color-amber)]"
      }`}
    >
      {respondido ? <CheckCircle2 size={10} /> : <Clock size={10} />}
      {respondido ? "Respondido" : "Novo"}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)]">
      <div
        className={`w-10 h-10 rounded-lg grid place-items-center ${accent}`}
      >
        <Icon size={18} />
      </div>
      <div>
        <div className="text-2xl font-display font-bold leading-none">{value}</div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-dim)] mt-1">{label}</div>
      </div>
    </div>
  );
}

export default function MensagensTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState({});
  const [expanded, setExpanded] = useState(null);

  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("todos");
  const [fServico, setFServico] = useState("");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setItems(await mensagensApi.list());
      setError(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const responder = async (m) => {
    const texto = (drafts[m.id] ?? m.resposta ?? "").trim();
    if (!texto) return alert("Escreva uma resposta.");
    setBusy((b) => ({ ...b, [m.id]: true }));
    try {
      const updated = await mensagensApi.responder(m.id, texto);
      setItems((cur) => cur.map((x) => (x.id === m.id ? updated : x)));
      setDrafts((d) => ({ ...d, [m.id]: "" }));
    } catch (e) {
      alert(`Falha: ${e.response?.data?.error || e.message}`);
    } finally {
      setBusy((b) => ({ ...b, [m.id]: false }));
    }
  };

  const remove = async (id) => {
    if (!confirm("Remover esta mensagem?")) return;
    try {
      await mensagensApi.remove(id);
      setItems((cur) => cur.filter((x) => x.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (e) {
      alert(`Falha: ${e.message}`);
    }
  };

  const mailHref = (m) => {
    const subject = `Re: contato Insight${m.servico ? ` — ${m.servico}` : ""}`;
    const body = drafts[m.id] ?? m.resposta ?? "";
    return `mailto:${m.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const servicosDisponiveis = useMemo(() => {
    const fromData = SERVICES.map((s) => s.title);
    const fromItems = items.map((i) => i.servico).filter(Boolean);
    return Array.from(new Set([...fromData, ...fromItems])).sort();
  }, [items]);

  // Aplica todos os filtros em memória (lista nunca é gigante; se um dia
  // crescer muito, paginar no backend e tirar este useMemo).
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const fromTs = fFrom ? new Date(fFrom + "T00:00:00").getTime() : null;
    const toTs = fTo ? new Date(fTo + "T23:59:59").getTime() : null;
    return items.filter((m) => {
      if (fStatus !== "todos" && m.status !== fStatus) return false;
      if (fServico && m.servico !== fServico) return false;
      const ts = new Date(m.created_at).getTime();
      if (fromTs && ts < fromTs) return false;
      if (toTs && ts > toTs) return false;
      if (term) {
        const blob = `${m.nome} ${m.email} ${m.empresa || ""} ${m.servico || ""} ${m.mensagem}`.toLowerCase();
        if (!blob.includes(term)) return false;
      }
      return true;
    });
  }, [items, q, fStatus, fServico, fFrom, fTo]);

  const stats = useMemo(() => {
    const novos = items.filter((m) => m.status === "novo").length;
    const respondidos = items.filter((m) => m.status === "respondido").length;
    const hoje = items.filter((m) => {
      const d = new Date(m.created_at);
      const n = new Date();
      return d.toDateString() === n.toDateString();
    }).length;
    return { total: items.length, novos, respondidos, hoje };
  }, [items]);

  const limpar = () => { setQ(""); setFStatus("todos"); setFServico(""); setFFrom(""); setFTo(""); };
  const algumFiltro = q || fStatus !== "todos" || fServico || fFrom || fTo;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Inbox} label="Total" value={stats.total} accent="bg-[var(--color-text)]/10 text-[var(--color-text)]" />
        <StatCard icon={Clock} label="Novas" value={stats.novos} accent="bg-[var(--color-amber)]/15 text-[var(--color-amber)]" />
        <StatCard icon={CheckCircle2} label="Respondidas" value={stats.respondidos} accent="bg-[var(--color-success)]/15 text-[var(--color-success)]" />
        <StatCard icon={Calendar} label="Hoje" value={stats.hoje} accent="bg-[var(--color-amber)]/15 text-[var(--color-amber)]" />
      </div>

      {/* Filtros */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, email, empresa, mensagem..."
              className={`${inputCls} pl-9`}
            />
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 min-h-[40px] px-3 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] text-sm"
            aria-label="Recarregar"
          >
            <RefreshCw size={14} /> Atualizar
          </button>
          {algumFiltro && (
            <button
              onClick={limpar}
              className="inline-flex items-center gap-2 min-h-[40px] px-3 rounded-lg border border-[var(--color-line)] hover:border-red-500 hover:text-red-400 text-sm"
            >
              <X size={14} /> Limpar
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mb-1.5">Status</span>
            <div className="flex rounded-lg border border-[var(--color-line)] bg-[var(--color-bg)] p-0.5">
              {[
                { v: "todos", l: "Todas" },
                { v: "novo", l: "Novas" },
                { v: "respondido", l: "Resp." },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setFStatus(opt.v)}
                  className={`flex-1 h-8 text-xs rounded-md transition-colors ${
                    fStatus === opt.v
                      ? "bg-[var(--color-amber)] text-black font-bold"
                      : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mb-1.5">Serviço</span>
            <div className="relative">
              <select
                value={fServico}
                onChange={(e) => setFServico(e.target.value)}
                className={`${inputCls} appearance-none pr-9 cursor-pointer`}
              >
                <option value="">Todos</option>
                {servicosDisponiveis.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mb-1.5">De</span>
            <input type="date" value={fFrom} onChange={(e) => setFFrom(e.target.value)} className={inputCls} />
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mb-1.5">Até</span>
            <input type="date" value={fTo} onChange={(e) => setFTo(e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--color-text-dim)] pt-1">
          <span className="inline-flex items-center gap-1.5">
            <Filter size={12} /> {filtered.length} de {items.length} mensagens
          </span>
        </div>
      </div>

      {/* Lista */}
      {loading && <p className="text-[var(--color-text-muted)] text-sm">Carregando...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <div className="p-10 rounded-xl bg-[var(--color-surface)] border border-dashed border-[var(--color-line)] text-center">
          <Inbox size={32} className="mx-auto text-[var(--color-text-dim)] mb-3" />
          <p className="text-[var(--color-text-muted)] text-sm">
            {items.length === 0 ? "Nenhuma mensagem recebida ainda." : "Nenhuma mensagem corresponde aos filtros."}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((m) => {
          const respondido = m.status === "respondido";
          const isOpen = expanded === m.id;
          return (
            <div
              key={m.id}
              className={`rounded-xl border bg-[var(--color-surface)] transition-colors ${
                isOpen
                  ? "border-[var(--color-amber)]"
                  : respondido
                  ? "border-[var(--color-line)]"
                  : "border-[var(--color-amber)]/30"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : m.id)}
                className="w-full text-left p-4 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] grid place-items-center font-display font-semibold text-[var(--color-amber)] shrink-0">
                  {initials(m.nome)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold text-[var(--color-text)] truncate">{m.nome}</span>
                    <StatusBadge status={m.status} />
                    {m.servico && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-line)] text-[var(--color-text-dim)] inline-flex items-center gap-1">
                        <Wrench size={9} /> {m.servico}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--color-text-dim)] mt-1 truncate">
                    {m.email}
                    {m.empresa ? ` · ${m.empresa}` : ""}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1.5 line-clamp-1">
                    {m.mensagem}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-dim)]">
                    {relTime(m.created_at)}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[var(--color-text-dim)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-[var(--color-line)] pt-4 space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-[var(--color-amber)]" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">Nome</div>
                        <div className="truncate">{m.nome}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-[var(--color-amber)]" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">Email</div>
                        <div className="truncate">{m.email}</div>
                      </div>
                    </div>
                    {m.empresa && (
                      <div className="flex items-center gap-2">
                        <Building2 size={13} className="text-[var(--color-amber)]" />
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">Empresa</div>
                          <div className="truncate">{m.empresa}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-[var(--color-amber)]" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">Recebida</div>
                        <div className="truncate">{fmtDateTime(m.created_at)}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mb-1.5">Mensagem</span>
                    <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] text-sm whitespace-pre-wrap text-[var(--color-text)]">
                      {m.mensagem}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">Resposta</span>
                      {m.respondido_em && (
                        <span className="text-[10px] font-mono text-[var(--color-text-dim)]">
                          Respondida em {fmtDateTime(m.respondido_em)}
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={4}
                      className={`${inputCls} h-auto min-h-[100px] resize-y`}
                      placeholder="Escreva uma resposta..."
                      value={drafts[m.id] ?? m.resposta ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [m.id]: e.target.value }))}
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => responder(m)}
                        disabled={busy[m.id]}
                        className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)] disabled:opacity-60 text-sm"
                      >
                        {respondido ? <CheckCircle2 size={15} /> : <Send size={15} />}
                        {busy[m.id] ? "Salvando..." : respondido ? "Atualizar resposta" : "Salvar resposta"}
                      </button>
                      <a
                        href={mailHref(m)}
                        className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] text-sm"
                      >
                        <Mail size={15} /> Email
                      </a>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(drafts[m.id] ?? m.resposta ?? "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-lg border border-[var(--color-line)] hover:border-[var(--color-amber)] text-sm"
                      >
                        <MessageCircle size={15} /> WhatsApp
                      </a>
                      <button
                        onClick={() => remove(m.id)}
                        className="ml-auto inline-flex items-center gap-2 min-h-[40px] px-4 rounded-lg border border-[var(--color-line)] hover:border-red-500 hover:text-red-400 text-sm"
                      >
                        <Trash2 size={15} /> Remover
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
