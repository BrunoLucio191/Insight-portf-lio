import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, TrendingUp, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useStore } from "../../../lib/store";
import { fadeUp, stagger } from "../../../lib/motion";

function PortfolioSection() {
  const { projects } = useStore();
  const types = useMemo(
    () => ["Todos", ...Array.from(new Set(projects.map((p) => p.type)))],
    [projects]
  );
  const [filter, setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? projects : projects.filter((p) => p.type === filter);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const timer = useRef();

  useEffect(() => setIndex(0), [filter, projects.length]);

  useEffect(() => {
    if (paused || filtered.length < 2) return;
    timer.current = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % filtered.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, [paused, filtered.length]);

  const go = (delta) => {
    setDir(delta);
    setIndex((i) => (i + delta + filtered.length) % filtered.length);
  };

  const current = filtered[index];

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

        {filtered.length === 0 ? (
          <p className="text-[var(--color-text-muted)] text-center py-16">Nenhum projeto cadastrado.</p>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            role="region"
            aria-roledescription="carrossel"
            aria-label="Projetos do portfólio"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg-soft)] min-h-[420px]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.article
                  key={current.id || current.title}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -60 }}
                  transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(1);
                    else if (info.offset.x > 80) go(-1);
                  }}
                  className="absolute inset-0 grid md:grid-cols-2 gap-0"
                >
                  <motion.div
                    custom={dir}
                    initial={{ x: dir * 40, opacity: 0, scale: 1.05 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: dir * -40, opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                    className="relative h-56 md:h-full bg-[var(--color-bg)] overflow-hidden"
                  >
                    {current.image ? (
                      <img src={current.image} alt={current.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-noise">
                        <span className="font-mono text-6xl text-[var(--color-amber)]/20 font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--color-amber)] text-black">
                        {current.type}
                      </span>
                      {current.year && (
                        <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-black/60 text-white border border-white/10 backdrop-blur">
                          {current.year}
                        </span>
                      )}
                    </div>
                  </motion.div>

                  <div className="p-7 sm:p-10 flex flex-col justify-center">
                    <div className="font-mono text-xs text-[var(--color-text-dim)] mb-2 flex items-center gap-2">
                      <span>{current.client}</span>
                      <span className="opacity-50">·</span>
                      <span>{current.sector}</span>
                    </div>
                    <h3 className="font-display font-semibold text-2xl sm:text-4xl text-[var(--color-text)] mb-4 leading-tight text-balance">
                      {current.title}
                    </h3>
                    <p className="text-[var(--color-text-muted)] leading-relaxed mb-6 line-clamp-3">
                      {current.outcome}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/20">
                        <TrendingUp size={14} className="text-[var(--color-amber)]" aria-hidden="true" />
                        <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-amber)]">
                          {current.metric}
                        </span>
                      </div>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-amber)] transition-colors underline underline-offset-4 decoration-[var(--color-line-strong)] hover:decoration-[var(--color-amber)]"
                      >
                        Ler estudo de caso
                      </button>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>

              <AnimatePresence>
                {modalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 20 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-amber)]/30 p-8 sm:p-12 rounded-2xl shadow-[var(--shadow-elevated)] relative"
                    >
                      <button 
                        onClick={() => setModalOpen(false)} 
                        className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-line)] text-[var(--color-text-dim)] hover:text-white transition-colors"
                        aria-label="Fechar modal"
                      >
                        ✕
                      </button>
                      <span className="font-mono text-[var(--color-amber)] text-xs uppercase tracking-widest block mb-4">
                        Case Study · {current.year || "2024"}
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl font-bold mb-8">{current.title}</h3>
                      
                      <div className="space-y-6 text-[var(--color-text-muted)] leading-relaxed">
                        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[var(--color-line)]">
                          <div>
                            <span className="block text-xs uppercase font-mono tracking-wider text-[var(--color-text-dim)] mb-1">Cliente</span>
                            <span className="font-medium text-[var(--color-text)]">{current.client}</span>
                          </div>
                          <div>
                            <span className="block text-xs uppercase font-mono tracking-wider text-[var(--color-text-dim)] mb-1">Setor</span>
                            <span className="font-medium text-[var(--color-text)]">{current.sector}</span>
                          </div>
                        </div>
                        
                        <div className="p-6 rounded-xl border-l-4 border-[var(--color-amber)] bg-[var(--color-amber)]/5 text-[var(--color-text)]">
                          <strong className="block mb-2 text-[var(--color-amber)] font-display text-lg">Resultado Gerado:</strong>
                          {current.outcome}
                        </div>
                        
                        <div>
                          <strong className="block mb-1 text-[var(--color-text)]">Métrica de Sucesso:</strong>
                          <span className="inline-flex items-center gap-2 text-[var(--color-amber)] font-mono">
                            <TrendingUp size={16} /> {current.metric}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => go(-1)}
                aria-label="Projeto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 grid place-items-center rounded-full bg-black/60 hover:bg-[var(--color-amber)] hover:text-black text-white border border-white/10 backdrop-blur transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Próximo projeto"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 grid place-items-center rounded-full bg-black/60 hover:bg-[var(--color-amber)] hover:text-black text-white border border-white/10 backdrop-blur transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex gap-1.5">
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                    aria-label={`Ir para projeto ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-8 bg-[var(--color-amber)]" : "w-2 bg-[var(--color-line-strong)] hover:bg-[var(--color-text-muted)]"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[var(--color-text-dim)]">
                  {String(index + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? "Retomar" : "Pausar"}
                  className="w-9 h-9 grid place-items-center rounded-full border border-[var(--color-line)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors"
                >
                  {paused ? <Play size={14} /> : <Pause size={14} />}
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filtered.map((p, i) => (
                <button
                  key={p.id || p.title}
                  onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                  className={`group text-left p-4 rounded-lg border transition-all ${
                    i === index
                      ? "border-[var(--color-amber)]/60 bg-[var(--color-amber)]/5"
                      : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-amber)]/30"
                  }`}
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] mb-1">
                    {p.type} · {p.sector}
                  </div>
                  <div className="font-display font-semibold text-sm leading-tight line-clamp-2">
                    {p.title}
                  </div>
                  <ArrowUpRight size={14} className="mt-2 text-[var(--color-text-dim)] group-hover:text-[var(--color-amber)]" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PortfolioSection;
