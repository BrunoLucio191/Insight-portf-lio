import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Award, Building2 } from "lucide-react";
import { fadeUp, stagger } from "../../../lib/motion";
import { useStore } from "../../../lib/store";
import { STATS } from "../../../lib/data";
import AnimatedCounter from "../../AnimatedCounter";
import HeroCarousel from "./HeroCarousel";

const TRUST = [
  { icon: Building2, label: "Vinculada à UFMA" },
  { icon: ShieldCheck, label: "Federada ao MEJ" },
  { icon: Award, label: "Prêmio MAJU 2025" },
];

function AnimatedGrid() {
  return (
    <div aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-noise">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-[#111] to-[var(--color-bg)]" />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/4 -right-1/4 w-[50rem] h-[50rem] rounded-full bg-[var(--color-amber)] blur-[120px] opacity-10 mix-blend-screen"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute -bottom-1/4 -left-1/4 w-[40rem] h-[40rem] rounded-full bg-[#ff9900] blur-[150px] opacity-10 mix-blend-screen"
      />
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18]"
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
    </div>
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
  const { site } = useStore();
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

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 w-full grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-12 items-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-amber)]/30 bg-[var(--color-amber)]/5 mb-6 sm:mb-8"
          >
            <Zap size={14} className="text-[var(--color-amber)]" aria-hidden="true" />
            <span className="font-mono text-xs tracking-wider uppercase text-[var(--color-amber)]">
              {site.heroBadge}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] tracking-[-0.04em] text-balance relative"
          >
            <motion.sup 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="absolute -top-6 -left-2 text-[var(--color-amber)] text-sm tracking-widest font-mono"
            >
              01 / ENG
            </motion.sup>
            Engenharia elétrica com{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="text-[var(--color-amber)] drop-shadow-md">precisão</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 w-full h-2 mix-blend-screen"
              >
                <motion.path
                  d="M2 8 Q 50 2, 100 6 T 198 5"
                  fill="none"
                  stroke="#ffc91f"
                  strokeWidth="3"
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
            {site.heroSubtitle}
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

          <motion.div variants={fadeUp} className="mt-10 grid grid-cols-2 gap-4 sm:hidden border-t border-[var(--color-line)] pt-8">
            {STATS.slice(0, 2).map((s) => (
              <div key={s.label}>
                <div className="font-display font-bold text-3xl text-[var(--color-amber)] mb-1">
                  <AnimatedCounter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-[var(--color-text-muted)] leading-tight">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block relative"
        >
          <motion.div 
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.9, 1.1, 0.9] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_center,var(--color-amber),transparent_60%)] blur-2xl pointer-events-none" 
          />
          <HeroCarousel />
        </motion.div>
      </div>

      <a
        href="#sobreNos"
        aria-label="Rolar para próxima seção"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[var(--color-text-dim)] hover:text-[var(--color-amber)] transition-colors group z-10"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap size={22} className="text-[var(--color-amber)] drop-shadow-[0_0_8px_rgba(255,201,31,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(255,201,31,0.9)] transition-all" />
        </motion.div>
      </a>
    </section>
  );
}

export default HeroSection;
