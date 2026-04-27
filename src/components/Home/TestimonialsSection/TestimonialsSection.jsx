import { TESTIMONIALS } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";
import { motion } from "framer-motion";

function TestimonialsSection() {
  // Triplicar para o efeito marquee infinito funcionar sem pulos
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

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

        <div className="relative w-full overflow-hidden flex py-8" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <div className="flex gap-6 sm:gap-8 w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] pr-6 sm:pr-8">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-33.333333%); }
              }
            `}</style>
            {marqueeItems.map((t, idx) => (
              <div
                key={`${idx}`}
                className="relative w-[320px] sm:w-[400px] shrink-0 p-8 sm:p-10 rounded-2xl glass hover:border-[var(--color-amber)]/30 hover:shadow-[var(--shadow-soft)] transition-all duration-300 group overflow-hidden flex flex-col"
              >
                <div 
                  className="absolute -top-12 -left-8 text-[12rem] font-display text-transparent opacity-[0.15] group-hover:opacity-30 transition-opacity duration-500 pointer-events-none select-none" 
                  style={{ WebkitTextStroke: "2px var(--color-amber)" }}
                  aria-hidden="true"
                >
                  &rdquo;
                </div>
                
                <p className="relative z-10 font-display text-lg sm:text-xl leading-relaxed text-[var(--color-text)] text-pretty mb-10">
                  “{t.quote}”
                </p>

                <footer className="mt-auto relative z-10 flex items-center gap-4 border-t border-[var(--color-line)] pt-5">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-line)] flex items-center justify-center font-mono text-[var(--color-text-muted)] text-lg shadow-[var(--shadow-soft)] group-hover:bg-[var(--color-amber)] group-hover:text-black group-hover:border-[var(--color-amber)] transition-colors duration-300">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-text)] tracking-tight">{t.name}</div>
                    <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider mt-1">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </footer>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-[var(--color-text-dim)] font-mono opacity-60">
          // depoimentos representativos — substituir por reais conforme forem coletados
        </p>
      </div>
    </section>
  );
}

export default TestimonialsSection;
