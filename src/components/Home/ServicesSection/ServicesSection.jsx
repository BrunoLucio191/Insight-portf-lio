import { useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Zap, ClipboardCheck, Cpu, Gauge, PencilRuler, Sun,
  Wrench, ShieldCheck, Lightbulb, Cable, Settings, Activity,
} from "lucide-react";
import { SERVICES as BASE_SERVICES } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";
import { useStore } from "../../../lib/store";

export const ICON_MAP = {
  zap: Zap, clipboard: ClipboardCheck, cpu: Cpu, gauge: Gauge,
  ruler: PencilRuler, sun: Sun, wrench: Wrench, shield: ShieldCheck,
  bulb: Lightbulb, cable: Cable, settings: Settings, activity: Activity,
};

function ServiceCard({ s, index, Icon }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      variants={fadeUp}
      className="group relative p-7 sm:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] hover:border-[var(--color-amber)]/50 transition-all duration-300 hover:shadow-[var(--shadow-elevated)] overflow-hidden"
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: "radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,201,31,0.08), transparent 40%)"
        }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-amber)]/10 border border-[var(--color-amber)]/20 flex items-center justify-center group-hover:bg-[var(--color-amber)] group-hover:border-[var(--color-amber)] transition-all duration-300 group-hover:scale-110">
            <Icon size={22} className="text-[var(--color-amber)] group-hover:text-black transition-colors" />
          </div>
          <span className="font-mono text-4xl font-bold text-[var(--color-line-strong)] opacity-50 group-hover:text-[var(--color-amber)] group-hover:opacity-20 transition-colors">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="font-display font-semibold text-xl mb-3 text-[var(--color-text)]">
          {s.title}
        </h3>
        <p className="text-[var(--color-text-muted)] text-[0.95rem] leading-relaxed mb-4">
          {s.desc}
        </p>

        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
          <div className="overflow-hidden">
            <p className="text-sm text-[var(--color-text-dim)] pt-4 border-t border-[var(--color-line)] mt-2">
              {s.detail}
            </p>
          </div>
        </div>

        <a
          href="#contato"
          aria-label={`Solicitar orçamento para ${s.title}`}
          className="absolute top-8 right-8 w-10 h-10 rounded-full border border-[var(--color-line)] flex items-center justify-center text-[var(--color-text-dim)] group-hover:border-[var(--color-amber)] group-hover:text-[var(--color-amber)] group-hover:rotate-45 group-hover:bg-[var(--color-amber)]/10 transition-all duration-300"
        >
          <ArrowUpRight size={18} />
        </a>
      </div>
    </motion.article>
  );
}

function ServicesSection() {
  const { services: stored } = useStore();
  const SERVICES = (stored && stored.length ? stored : BASE_SERVICES.map((s, i) => ({
    title: s.title, desc: s.desc, detail: s.detail,
    iconKey: ["zap", "clipboard", "cpu", "gauge", "ruler", "sun"][i] || "zap",
  }))).map((s) => ({ ...s, icon: ICON_MAP[s.iconKey] || Zap }));
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
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return <ServiceCard key={s.id || `${s.title}-${i}`} s={s} index={i} Icon={Icon} />;
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesSection;
