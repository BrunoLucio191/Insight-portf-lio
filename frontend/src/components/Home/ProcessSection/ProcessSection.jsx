import { motion } from "framer-motion";
import { PROCESS } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";

function ProcessSection() {
  return (
    <section
      id="processo"
      className="relative py-20 sm:py-28 border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)]"
          >
            // 04 — Como trabalhamos
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance"
          >
            Quatro etapas, <span className="text-[var(--color-amber)]">zero surpresas</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-lg text-[var(--color-text-muted)]"
          >
            Processo direto, transparente e com cronograma fechado antes de começar.
          </motion.p>
        </motion.div>

        <div className="relative mt-12 sm:mt-16">
          <div className="absolute left-[25px] top-6 md:top-[30px] md:left-0 w-px h-[calc(100%-2rem)] md:w-[calc(100%-2rem)] md:h-px bg-[var(--color-line-strong)] z-0">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="md:hidden w-full h-full origin-top bg-gradient-to-b from-[var(--color-amber)] via-[var(--color-amber)] to-transparent shadow-[var(--shadow-amber)]"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="hidden md:block w-full h-full origin-left bg-gradient-to-r from-[var(--color-amber)] via-[var(--color-amber)] to-transparent shadow-[var(--shadow-amber)]"
            />
          </div>

          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col md:flex-row gap-10 md:gap-6 lg:gap-10 pl-14 md:pl-0 pt-0 md:pt-16 relative z-10"
            aria-label="Etapas do processo"
          >
            {PROCESS.map((p, idx) => (
              <motion.li
                key={p.n}
                variants={fadeUp}
                className="relative group flex-1"
              >
                <div className="absolute -left-11 top-6 md:top-auto md:-top-[2.25rem] md:left-6 w-5 h-5 -translate-x-[2px] md:translate-x-0 md:-translate-y-[2px] rounded-full bg-[var(--color-bg)] border-[3px] border-[var(--color-amber)] group-hover:bg-[var(--color-amber)] transition-colors duration-500 shadow-[var(--shadow-amber)] z-10" />

                <div className="card-base rounded-2xl p-7 lg:p-8 hover:border-[var(--color-amber)]/40 hover:shadow-[var(--shadow-elevated)] transition-all duration-300 group-hover:-translate-y-1 h-full">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="font-display font-bold text-4xl text-[var(--color-amber)] leading-none drop-shadow-[0_0_8px_rgba(255,201,31,0.3)]">
                      {p.n}
                    </span>
                    <span className="font-mono text-xs text-[var(--color-text-dim)] uppercase tracking-widest hidden lg:block">
                      Etapa
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-xl lg:text-2xl mb-3 text-[var(--color-text)] leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-[0.95rem] text-[var(--color-text-muted)] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
