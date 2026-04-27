import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { PORTFOLIO } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";

function PortfolioSection() {
  const types = useMemo(
    () => ["Todos", ...Array.from(new Set(PORTFOLIO.map((p) => p.type)))],
    []
  );
  const [filter, setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? PORTFOLIO : PORTFOLIO.filter((p) => p.type === filter);

  return (
    <section id="portfolio" className="relative py-20 sm:py-28 border-t border-[var(--color-line)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-14"
        >
          <div className="max-w-2xl">
            <motion.span variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)]">
              // 05 — Portfólio
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
              Histórico de <span className="text-[var(--color-amber)]">atuação</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-lg text-[var(--color-text-muted)]">
              Casos reais entregues para clientes institucionais e privados.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} role="tablist" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={filter === t}
                onClick={() => setFilter(t)}
                className={`min-h-[44px] px-4 rounded-full text-sm font-medium font-mono transition-colors ${
                  filter === t
                    ? "bg-[var(--color-amber)] text-black"
                    : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-line)] hover:text-[var(--color-text)] hover:border-[var(--color-amber)]/40"
                }`}
              >
                {t}
              </button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.article
                key={p.title}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="group relative p-7 sm:p-8 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-amber)]/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--color-amber)]/10 text-[var(--color-amber)] border border-[var(--color-amber)]/20">
                      {p.type}
                    </span>
                    <span className="font-mono text-xs text-[var(--color-text-dim)]">
                      {p.sector}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-[var(--color-text-dim)] group-hover:text-[var(--color-amber)] group-hover:rotate-45 transition-all"
                  />
                </div>

                <div className="font-mono text-xs text-[var(--color-text-dim)] mb-2">
                  {p.client}
                </div>
                <h3 className="font-display font-semibold text-2xl sm:text-3xl text-[var(--color-text)] mb-3 leading-tight text-balance">
                  {p.title}
                </h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                  {p.outcome}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/20">
                  <TrendingUp size={14} className="text-[var(--color-amber)]" aria-hidden="true" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-amber)]">
                    {p.metric}
                  </span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default PortfolioSection;
