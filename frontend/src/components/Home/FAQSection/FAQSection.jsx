import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";

function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="relative py-20 sm:py-28 border-t border-[var(--color-line)]"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)]"
          >
            // 06 — Perguntas frequentes
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display font-bold text-4xl sm:text-5xl leading-[1.05] text-balance"
          >
            Tire suas <span className="text-[var(--color-amber)]">dúvidas</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-3"
        >
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <motion.div
                key={item.q}
                variants={fadeUp}
                className="card-base rounded-xl overflow-hidden"
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel`}
                    id={`${id}-trigger`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 text-left p-5 sm:p-6 min-h-[64px] hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-display font-semibold text-base sm:text-lg text-[var(--color-text)] text-pretty">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/30 flex items-center justify-center text-[var(--color-amber)]"
                    >
                      <Plus size={16} />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${id}-panel`}
                      role="region"
                      aria-labelledby={`${id}-trigger`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-[var(--color-text-muted)] leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default FAQSection;
