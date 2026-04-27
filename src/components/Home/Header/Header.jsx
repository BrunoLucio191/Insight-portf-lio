import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "../../../assets/logo_insight.png";
import { NAV, CONTACT } from "../../../lib/data";

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-[var(--color-line)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="#inicio" onClick={close} className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Insight Engenharia Júnior" className="h-9 sm:h-10 w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
          {NAV.filter((n) => n.label !== "Contato").map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="press text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-amber)]"
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-[var(--color-line)] bg-black/95 backdrop-blur-md"
          >
            <nav className="px-5 py-6 flex flex-col gap-1" aria-label="Menu mobile">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={close}
                  className="py-3 px-3 rounded-md text-base font-medium text-[var(--color-text)] hover:bg-white/5 hover:text-[var(--color-amber)] transition"
                >
                  {n.label}
                </a>
              ))}
              <a
                href={`https://wa.me/${CONTACT.whatsappPrimary}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="mt-3 px-5 py-3.5 rounded-md bg-[var(--color-amber)] text-black text-center text-base font-bold hover:bg-[var(--color-amber-soft)]"
              >
                Solicitar Orçamento
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
