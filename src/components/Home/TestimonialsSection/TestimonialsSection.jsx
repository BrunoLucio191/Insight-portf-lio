import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";

function TestimonialsSection() {
  const [i, setI] = useState(0);
  const total = TESTIMONIALS.length;
  const next = () => setI((v) => (v + 1) % total);
  const prev = () => setI((v) => (v - 1 + total) % total);
  const t = TESTIMONIALS[i];

  return (
    <section
      id="depoimentos"
      className="relative py-20 sm:py-28 border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]"
      aria-label="Depoimentos de clientes"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <motion.span variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)]">
            // 06 — Depoimentos
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-4 font-display font-bold text-4xl sm:text-5xl leading-[1.05] text-balance">
            O que dizem nossos <span className="text-[var(--color-amber)]">parceiros</span>
          </motion.h2>
        </motion.div>

        <div
          className="relative rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] p-8 sm:p-12 overflow-hidden"
          aria-roledescription="carrossel"
          aria-live="polite"
        >
          <Quote
            size={64}
            aria-hidden="true"
            className="absolute -top-2 -left-2 text-[var(--color-amber)]/10"
          />

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="relative"
            >
              <p className="font-display text-2xl sm:text-3xl leading-snug text-[var(--color-text)] text-balance">
                “{t.quote}”
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-amber)]/15 border border-[var(--color-amber)]/30 flex items-center justify-center font-mono text-[var(--color-amber)] text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-[var(--color-text)]">{t.name}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {t.role} — {t.company}
                  </div>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Selecionar depoimento">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={i === idx}
                  aria-label={`Depoimento ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-2 rounded-full transition-all ${
                    i === idx ? "w-8 bg-[var(--color-amber)]" : "w-2 bg-[var(--color-line)]"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Depoimento anterior"
                className="w-11 h-11 rounded-full border border-[var(--color-line)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors flex items-center justify-center"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Próximo depoimento"
                className="w-11 h-11 rounded-full border border-[var(--color-line)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)] transition-colors flex items-center justify-center"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[var(--color-text-dim)] font-mono">
          {/* TODO: substituir por depoimentos reais conforme forem coletados */}
          // depoimentos representativos — substituir por reais conforme forem coletados
        </p>
      </div>
    </section>
  );
}

export default TestimonialsSection;
