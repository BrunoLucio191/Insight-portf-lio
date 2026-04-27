import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Award, Building2 } from "lucide-react";
import { fadeUp, stagger } from "../../../lib/motion";

const TRUST = [
  { icon: Building2, label: "Vinculada à UFMA" },
  { icon: ShieldCheck, label: "Federada ao MEJ" },
  { icon: Award, label: "Prêmio MAJU 2025" },
];

function AnimatedGrid() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,201,31,0.35)" strokeWidth="0.6" />
        </pattern>
        <radialGradient id="hero-fade" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="hero-mask">
          <rect width="100%" height="100%" fill="url(#hero-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" mask="url(#hero-mask)" />
    </svg>
  );
}

function CircuitLine() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 600"
      className="absolute -right-24 -bottom-24 w-[36rem] h-[36rem] opacity-30 hidden md:block"
    >
      <motion.path
        d="M50 300 H200 L240 260 H360 L400 300 H550"
        fill="none"
        stroke="#ffc91f"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
      />
      <motion.circle cx="240" cy="260" r="4" fill="#ffc91f" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="400" cy="300" r="4" fill="#ffc91f" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }} />
    </svg>
  );
}

function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex items-center pt-24 sm:pt-28 pb-16 overflow-hidden"
      aria-label="Apresentação Insight Engenharia Júnior"
    >
      <AnimatedGrid />
      <CircuitLine />

      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-40 w-[28rem] h-[28rem] rounded-full bg-[var(--color-amber)] opacity-[0.07] blur-[120px] pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 w-full">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/5 mb-6 sm:mb-8"
          >
            <Zap size={14} className="text-[var(--color-amber)]" aria-hidden="true" />
            <span className="font-mono text-xs tracking-wider uppercase text-[var(--color-amber)]">
              Empresa Júnior · UFMA · desde 2017
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-[clamp(2.25rem,7vw,5.5rem)] leading-[1.02] tracking-tight text-balance"
          >
            Engenharia elétrica com{" "}
            <span className="relative inline-block">
              <span className="text-[var(--color-amber)]">precisão</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 w-full h-2"
              >
                <motion.path
                  d="M2 8 Q 50 2, 100 6 T 198 5"
                  fill="none"
                  stroke="#ffc91f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                />
              </svg>
            </span>{" "}
            júnior
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 sm:mt-8 max-w-2xl text-lg sm:text-xl text-[var(--color-text-muted)] text-pretty leading-relaxed"
          >
            Projetos elétricos, automação e eficiência energética com a qualidade técnica
            da UFMA e o preço justo de uma empresa júnior.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#contato"
              aria-label="Solicitar orçamento — formulário de contato"
              className="press inline-flex items-center justify-center gap-2 min-h-[52px] px-7 rounded-md bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)] hover:shadow-[var(--shadow-amber)] hover:-translate-y-0.5"
            >
              Solicitar Orçamento
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href="#servicos"
              className="press inline-flex items-center justify-center gap-2 min-h-[52px] px-7 rounded-md border border-[var(--color-line-strong)] text-[var(--color-text)] font-semibold hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]"
            >
              Conheça nossos serviços
            </a>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl"
            aria-label="Sinais de confiança"
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.02] border border-[var(--color-line)]"
              >
                <div className="w-9 h-9 rounded-md bg-[var(--color-amber)]/10 flex items-center justify-center text-[var(--color-amber)] shrink-0">
                  <Icon size={16} aria-hidden="true" />
                </div>
                <span className="text-sm text-[var(--color-text)] font-medium">{label}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <a
        href="#sobreNos"
        aria-label="Rolar para próxima seção"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[var(--color-text-dim)] hover:text-[var(--color-amber)] transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="w-px h-8 bg-gradient-to-b from-[var(--color-amber)] to-transparent" />
      </a>
    </section>
  );
}

export default HeroSection;
