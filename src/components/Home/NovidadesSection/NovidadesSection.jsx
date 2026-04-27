// Seção de Novidades — mural de campanhas, eventos e novidades da Insight.
// Itens gerenciados pelo admin (aba "Novidades"). Pinned aparecem primeiro,
// expirados são ocultados automaticamente sem precisar deletar.
import { motion } from "framer-motion";
import { ArrowRight, Pin, Calendar } from "lucide-react";
import { useStore } from "../../../lib/store";
import { fadeUp, stagger } from "../../../lib/motion";

// Cor do badge por tipo de item.
const TYPE_COLOR = {
  Campanha:  "bg-blue-500/10   border-blue-500/30   text-blue-300",
  Novidade:  "bg-[var(--color-amber)]/10 border-[var(--color-amber)]/30 text-[var(--color-amber)]",
  Promoção:  "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  Evento:    "bg-purple-500/10  border-purple-500/30  text-purple-300",
};

function NovidadeCard({ item }) {
  const expired = item.expiresAt && new Date(item.expiresAt) < new Date();
  if (!item.active || expired) return null;

  const badgeCls = TYPE_COLOR[item.type] || TYPE_COLOR.Novidade;

  return (
    <motion.article
      variants={fadeUp}
      className="group relative flex flex-col rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-amber)]/40 transition-all duration-300 hover:shadow-[var(--shadow-elevated)] overflow-hidden"
    >
      {/* Imagem opcional no topo do card */}
      {item.image && (
        <div className="h-44 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 sm:p-7">
        {/* Badges: tipo + pin */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeCls}`}>
            {item.type}
          </span>
          {item.pinned && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-[var(--color-line)] text-[var(--color-text-dim)]">
              <Pin size={10} /> Fixado
            </span>
          )}
          {item.expiresAt && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--color-text-dim)]">
              <Calendar size={10} />
              até {new Date(item.expiresAt).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>

        <h3 className="font-display font-semibold text-xl leading-tight mb-3 text-[var(--color-text)]">
          {item.title}
        </h3>
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed flex-1">
          {item.body}
        </p>

        {/* CTA opcional */}
        {item.cta?.label && (
          <a
            href={item.cta.href || "#contato"}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-amber)] hover:gap-3 transition-all"
          >
            {item.cta.label} <ArrowRight size={15} />
          </a>
        )}
      </div>

      {/* Linha decorativa amber no topo do card */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-amber)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </motion.article>
  );
}

function NovidadesSection() {
  const { novidades = [] } = useStore();

  // Pinned no topo, depois por data de criação (mais recente primeiro).
  const sorted = [...novidades].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  // Filtra inativos e expirados para contar quantos aparecem de verdade.
  const visible = sorted.filter(
    (n) => n.active && !(n.expiresAt && new Date(n.expiresAt) < new Date())
  );

  if (!visible.length) return null;

  return (
    <section id="novidades" className="relative py-20 sm:py-28 border-t border-[var(--color-line)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <motion.span variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)]">
            // 06 — Novidades
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Campanhas e <span className="text-[var(--color-amber)]">novidades</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-lg text-[var(--color-text-muted)]">
            Acompanhe as últimas campanhas, promoções e eventos da Insight.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {sorted.map((item) => (
            <NovidadeCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default NovidadesSection;
