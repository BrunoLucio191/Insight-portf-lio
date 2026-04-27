import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../../lib/store";

function HeroCarousel() {
  const { heroSlides } = useStore();
  const [i, setI] = useState(0);
  const slides = heroSlides || [];

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length, i]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slides[i].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.img
            src={slides[i].image}
            alt={slides[i].caption || "Slide"}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 12, ease: "linear" }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div
            aria-hidden="true"
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background:
                "radial-gradient(60% 60% at 70% 20%, rgba(255,201,31,0.25), transparent 70%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 z-10">
        <div className="flex flex-col gap-2 max-w-sm">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)] font-semibold drop-shadow-md">
            Destaque
          </span>
          <p className="font-display text-xl sm:text-2xl font-semibold leading-snug text-white text-balance drop-shadow-lg">
            {slides[i].caption}
          </p>
        </div>
        <div className="flex flex-col gap-3 shrink-0 items-end">
          <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden shrink-0 max-w-[120px]">
            <motion.div 
              key={i}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="h-full bg-[var(--color-amber)]"
            />
          </div>
          <div className="flex gap-1.5 shrink-0">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-7 bg-[var(--color-amber)]" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--color-amber)]/60 to-transparent"
      />
    </div>
  );
}

export default HeroCarousel;
