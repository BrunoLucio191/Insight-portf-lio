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

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          aria-label="Etapas do processo"
        >
          {PROCESS.map((p, idx) => (
            <motion.li
              key={p.n}
              variants={fadeUp}
              className="relative card-base rounded-xl p-7 hover:border-[var(--color-amber)]/40 press"
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-xs text-[var(--color-text-dim)]">
                  Etapa
                </span>
                <span className="font-display font-bold text-3xl text-[var(--color-amber)] leading-none">
                  {p.n}
                </span>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2 text-[var(--color-text)]">
                {p.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {p.desc}
              </p>

              {idx < PROCESS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-[var(--color-amber)]/40 to-transparent"
                />
              )}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

export default ProcessSection;
