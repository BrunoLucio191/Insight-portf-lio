import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../../../assets/logo_insight.png";
import { NAV, CONTACT } from "../../../lib/data";

function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      
      const sections = NAV.map(n => document.querySelector(n.href)).filter(Boolean);
      let currentId = "";
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 150) {
          currentId = "#" + sec.id;
        }
      });
      setActive(currentId || "#inicio");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-[var(--color-amber)]/20 shadow-[var(--shadow-soft)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="#inicio" onClick={close} className="flex items-center gap-2 shrink-0 group" aria-label="Insight Engenharia Júnior - Início">
          <img src={logo} alt="Insight Engenharia Júnior" className="h-9 sm:h-10 w-auto select-none group-hover:opacity-90 transition-opacity" />
        </a>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
          {NAV.filter((n) => n.label !== "Contato").map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`press text-sm font-medium transition-colors ${
                active === n.href ? "text-[var(--color-amber)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#contato"
            className="px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-amber)] transition-colors"
          >
            Contato
          </a>
          <a
            href={`https://wa.me/${CONTACT.whatsappPrimary}?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento`}
            target="_blank"
            rel="noopener noreferrer"
            className="press px-5 py-2.5 rounded-md bg-[var(--color-amber)] text-black text-sm font-bold hover:bg-[var(--color-amber-soft)] hover:shadow-[var(--shadow-amber)]"
          >
            Solicitar Orçamento
          </a>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-[var(--color-text)] min-h-[48px] min-w-[48px] flex items-center justify-center"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed inset-0 top-[64px] sm:top-[80px] bg-black/95 backdrop-blur-2xl border-t border-[var(--color-line)] z-40 overflow-y-auto"
          >
            <nav className="px-6 py-10 flex flex-col gap-6" aria-label="Menu mobile">
              {NAV.map((n, idx) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={close}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className={`text-2xl font-display font-medium transition-colors ${
                    active === n.href ? "text-[var(--color-amber)]" : "text-[var(--color-text)]"
                  }`}
                >
                  {n.label}
                </motion.a>
              ))}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 pt-8 border-t border-[var(--color-line)]"
              >
                <a
                  href={`https://wa.me/${CONTACT.whatsappPrimary}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="w-full flex items-center justify-center min-h-[56px] rounded-xl bg-[var(--color-amber)] text-black text-lg font-bold hover:bg-[var(--color-amber-soft)] press"
                >
                  Solicitar Orçamento
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
