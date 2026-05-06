import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";

function FAQSection() {
  return (
    <section
      id="faq"
      className="relative py-20 sm:py-28 border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]"
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
            // 07 — Perguntas frequentes
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
          className="space-y-4"
        >
          {FAQ.map((item, i) => (
            <motion.details
              key={item.q}
              variants={fadeUp}
              name="faq-accordion"
              className="group card-base rounded-2xl border border-[var(--color-line)] hover:border-[var(--color-amber)]/40 transition-colors overflow-hidden open:bg-white/[0.02]"
            >
              <summary className="w-full flex items-center justify-between gap-4 text-left p-6 sm:p-7 cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)]">
                <span className="font-display font-semibold text-lg text-[var(--color-text)] text-pretty pr-4 group-open:text-[var(--color-amber)] transition-colors">
                  {item.q}
                </span>
                <span className="shrink-0 w-10 h-10 rounded-full bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/30 flex items-center justify-center text-[var(--color-amber)] group-open:rotate-45 group-open:bg-[var(--color-amber)] group-open:text-black transition-all duration-300">
                  <Plus size={18} />
                </span>
              </summary>
              <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                <div className="overflow-hidden">
                  <p className="px-6 sm:px-7 pb-6 sm:pb-7 text-[var(--color-text-muted)] leading-relaxed animate-[fade-in-down_0.3s_ease-out]">
                    {item.a}
                  </p>
                </div>
              </div>
            </motion.details>
          ))}
        </motion.div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </section>
  );
}

export default FAQSection;
