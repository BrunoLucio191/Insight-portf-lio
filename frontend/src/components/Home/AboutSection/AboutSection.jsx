import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";
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
  "Comprometimento",
];

const TIMELINE = [
  { year: 2017, title: "Fundação", desc: "Criada por alunos de Eng. Elétrica da UFMA." },
  { year: 2021, title: "Federação", desc: "Integração oficial ao Movimento Empresa Júnior (MEJ)." },
  { year: 2025, title: "Prêmio MAJU", desc: "Reconhecimento por excelência em projetos e gestão." }
];

function AboutSection() {
  const [activeTab, setActiveTab] = useState(0);

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
                  className="flex items-center gap-2 text-sm text-[var(--color-text)] font-medium"
                >
                  <CheckCircle2 size={16} className="text-[var(--color-amber)] shrink-0" />
                  {v}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-[var(--color-line)] relative flex items-center justify-between">
              <div className="absolute -top-[1.5px] left-0 w-full overflow-visible">
                <svg width="100%" height="3" className="overflow-visible">
                  <motion.line
                    x1="0" y1="1.5" x2="100%" y2="1.5"
                    stroke="var(--color-amber)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    initial={{ strokeDashoffset: 100, opacity: 0 }}
                    whileInView={{ strokeDashoffset: 0, opacity: 0.5 }}
                    transition={{ duration: 2, ease: "linear" }}
                    viewport={{ once: true }}
                  />
                  <motion.circle 
                    cx="0" cy="1.5" r="3" fill="var(--color-amber)" 
                    initial={{ cx: "0%" }}
                    whileInView={{ cx: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    viewport={{ once: true }}
                  />
                </svg>
              </div>
              <span className="text-[var(--color-amber)] text-xs font-mono tracking-widest uppercase">2017</span>
              <span className="text-[var(--color-text-dim)] text-xs font-mono tracking-widest uppercase">Hoje</span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-8 lg:sticky lg:top-28"
          >
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {STATS.map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-amber)]/40 hover:shadow-[var(--shadow-soft)] transition-all duration-300 group"
                >
                  <div className="font-display font-bold text-4xl sm:text-5xl text-[var(--color-amber)] leading-none group-hover:scale-105 origin-left transition-transform duration-300">
                    <AnimatedCounter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-4 text-sm text-[var(--color-text-muted)] font-medium">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Zap size={120} />
              </div>
              <h3 className="font-display text-xl font-bold mb-8 text-[var(--color-text)]">Nossa Trajetória</h3>
              
              <div className="relative">
                <div className="absolute top-[14px] left-[14px] right-[14px] h-[2px] bg-[var(--color-line-strong)] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[var(--color-amber)] shadow-[var(--shadow-glow-amber)]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(activeTab / (TIMELINE.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex justify-between relative z-10">
                  {TIMELINE.map((t, idx) => (
                    <button 
                      key={t.year}
                      onClick={() => setActiveTab(idx)}
                      className="flex flex-col items-center gap-4 group/btn relative focus-visible:outline-none"
                    >
                      <div className={`w-[30px] h-[30px] rounded-full border-2 bg-[var(--color-surface)] flex items-center justify-center transition-colors duration-300 ${activeTab >= idx ? "border-[var(--color-amber)]" : "border-[var(--color-line-strong)] group-hover/btn:border-[var(--color-text-dim)]"}`}>
                        <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${activeTab === idx ? "bg-[var(--color-amber)] shadow-[var(--shadow-glow-amber)]" : activeTab > idx ? "bg-[var(--color-amber)]/40" : "bg-transparent"}`} />
                      </div>
                      <span className={`font-mono text-xs font-semibold transition-colors duration-300 ${activeTab >= idx ? "text-[var(--color-amber)]" : "text-[var(--color-text-dim)] group-hover/btn:text-[var(--color-text-muted)]"}`}>{t.year}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 min-h-[90px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-display font-bold text-lg text-[var(--color-text)]">{TIMELINE[activeTab].title}</h4>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">{TIMELINE[activeTab].desc}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
