import { Mail, MessageCircle } from "lucide-react";
import InstagramIcon from "./icons/InstagramIcon";
import logo from "../assets/logo_insight.png";
import { CONTACT, NAV } from "../lib/data";

function Footer() {
  return (
    <footer className="relative bg-[var(--color-bg-soft)] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-amber)]/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          <div>
            <img src={logo} alt="Insight Engenharia Júnior" className="h-10 w-auto mb-4" />
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-sm mt-4">
              Empresa Júnior de Engenharia Elétrica da Universidade Federal do Maranhão.
              Transformando teoria em projetos de excelência.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)] mb-4">
              Navegação
            </h4>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-amber)] transition-colors"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)] mb-4">
              Contato
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-amber)] transition-colors break-all"
              >
                <Mail size={16} /> {CONTACT.email}
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsappPrimary}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-amber)] transition-colors"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a
                href={`https://instagram.com/${CONTACT.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-amber)] transition-colors"
              >
                <InstagramIcon size={16} /> @{CONTACT.instagram}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-line)] flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-xs text-[var(--color-text-dim)] text-center md:text-left">
            © {new Date().getFullYear()} Insight Engenharia Júnior · Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-[var(--color-text-dim)]">
            <span>São Luís — MA</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-line-strong)]" />
            <span>Vinculada ao DEE/UFMA</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-line-strong)]" />
            <span>Federada ao MEJ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
