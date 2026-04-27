import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import AnimatedCounter from "../../AnimatedCounter";
import { STATS } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";

const VALUES = [
  "Excelência",
  "Qualidade",
  "Ética e transparência",
  "Respeito",
  "Sentimento de dono",
  "Comprometimento",
];

function AboutSection() {
  return (
    <section
      id="sobreNos"
      className="relative py-20 sm:py-28 border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.span variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)]">
              // 02 — Quem somos
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-display font-bold text-4xl sm:text-5xl leading-[1.05] text-balance">
              Empresa Júnior de <span className="text-[var(--color-amber)]">Engenharia Elétrica</span> da UFMA
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-6 text-[var(--color-text-muted)] text-lg leading-relaxed">
              Fundada em <span className="text-[var(--color-text)] font-semibold">19 de Março de 2017</span>{" "}
              por alunos do curso de Engenharia Elétrica da Universidade Federal do Maranhão.
              Atuamos no desenvolvimento de projetos que conectam o conhecimento acadêmico à
              prática profissional.
            </motion.p>

            <motion.p variants={fadeUp} className="mt-4 text-[var(--color-text-muted)] leading-relaxed">
              Federada ao <span className="text-[var(--color-text)] font-semibold">Movimento Empresa Júnior (MEJ)</span>,
              entregamos soluções viáveis com excelência técnica e o entusiasmo de quem está
              aprendendo e crescendo a cada projeto.
            </motion.p>

            <motion.ul variants={stagger} className="mt-8 grid grid-cols-2 gap-2.5">
              {VALUES.map((v) => (
                <motion.li
                  key={v}
                  variants={fadeUp}
                  className="flex items-center gap-2 text-sm text-[var(--color-text)]"
                >
                  <CheckCircle2 size={16} className="text-[var(--color-amber)] shrink-0" />
                  {v}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 gap-4 lg:sticky lg:top-28"
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="p-6 sm:p-7 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-amber)]/40 transition-colors"
              >
                <div className="font-display font-bold text-4xl sm:text-5xl text-[var(--color-amber)] leading-none">
                  <AnimatedCounter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-3 text-sm text-[var(--color-text-muted)] font-medium">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
