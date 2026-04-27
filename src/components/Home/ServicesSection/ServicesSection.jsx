import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";

function ServicesSection() {
  return (
    <section id="servicos" className="relative py-20 sm:py-28 border-t border-[var(--color-line)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <motion.span variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)]">
            // 03 — Serviços
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Soluções técnicas em <span className="text-[var(--color-amber)]">engenharia elétrica</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-[var(--color-text-muted)] text-lg">
            Seis frentes de atuação cobrindo todo o ciclo do seu projeto — do laudo à automação.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.title}
                variants={fadeUp}
                className="group relative p-7 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-amber)]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[var(--color-amber)] opacity-0 group-hover:opacity-[0.06] blur-3xl transition-opacity duration-500" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/20 flex items-center justify-center mb-5 group-hover:bg-[var(--color-amber)] group-hover:border-[var(--color-amber)] transition-colors">
                    <Icon size={22} className="text-[var(--color-amber)] group-hover:text-black transition-colors" />
                  </div>

                  <h3 className="font-display font-semibold text-xl mb-2.5 text-[var(--color-text)]">
                    {s.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-[0.95rem] leading-relaxed mb-4">
                    {s.desc}
                  </p>

                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
                    <div className="overflow-hidden">
                      <p className="text-sm text-[var(--color-text-dim)] pt-3 border-t border-[var(--color-line)] mt-3">
                        {s.detail}
                      </p>
                    </div>
                  </div>

                  <a
                    href="#contato"
                    aria-label={`Solicitar orçamento para ${s.title}`}
                    className="absolute top-5 right-5 w-9 h-9 rounded-full border border-[var(--color-line)] flex items-center justify-center text-[var(--color-text-dim)] group-hover:border-[var(--color-amber)] group-hover:text-[var(--color-amber)] group-hover:rotate-45 transition-all"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesSection;
