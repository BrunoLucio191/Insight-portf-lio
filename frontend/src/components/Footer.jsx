import { Mail, MessageCircle } from "lucide-react";
import InstagramIcon from "./icons/InstagramIcon";
import logo from "../assets/logo_insight.png";
import { CONTACT, NAV } from "../lib/data";

function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <img src={logo} alt="Insight Engenharia Júnior" className="h-10 w-auto mb-4" />
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-sm">
              Empresa Júnior de Engenharia Elétrica da Universidade Federal do Maranhão.
              Excelência em seus projetos.
            </p>
            <p className="mt-4 text-xs font-mono text-[var(--color-text-dim)]">
              Vinculada ao DEE — UFMA · Federada ao MEJ
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

        <div className="mt-12 pt-6 border-t border-[var(--color-line)] flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--color-text-dim)]">
            © {new Date().getFullYear()} Insight Engenharia Júnior · Todos os direitos reservados.
          </p>
          <p className="text-xs font-mono text-[var(--color-text-dim)]">
            São Luís — MA · UFMA
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
