import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Send, CheckCircle2, AlertCircle } from "lucide-react";
import InstagramIcon from "../../icons/InstagramIcon";
import { CONTACT } from "../../../lib/data";
import { fadeUp, stagger } from "../../../lib/motion";

const initialForm = { name: "", email: "", company: "", message: "" };

function validate(form) {
  const e = {};
  if (!form.name.trim()) e.name = "Informe seu nome.";
  if (!form.email.trim()) e.email = "Informe seu email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido.";
  if (!form.message.trim()) e.message = "Conte um pouco sobre o projeto.";
  else if (form.message.trim().length < 10) e.message = "Mensagem muito curta (mín. 10 caracteres).";
  return e;
}

function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    if (touched[k]) {
      const next = validate({ ...form, [k]: value });
      setErrors(next);
    }
  };
  const onBlur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const submit = (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(v).length) {
      const first = document.getElementById(`ct-${Object.keys(v)[0]}`);
      first?.focus();
      return;
    }
    const text =
      `Olá! Sou ${form.name}` +
      (form.company ? ` (${form.company})` : "") +
      `.\nEmail: ${form.email}\n\n${form.message}`;
    const url = `https://wa.me/${CONTACT.whatsappPrimary}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm(initialForm);
      setTouched({});
    }, 4000);
  };

  const fieldClass = (key) =>
    `w-full min-h-[48px] px-4 rounded-lg bg-[var(--color-bg)] border text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-amber)] press ${
      errors[key] && touched[key]
        ? "border-[var(--color-danger)]"
        : "border-[var(--color-line)]"
    }`;

  return (
    <section
      id="contato"
      className="relative py-20 sm:py-28 border-t border-[var(--color-line)] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-bg opacity-40 pointer-events-none"
        style={{ maskImage: "radial-gradient(ellipse at top, black, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.span variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-amber)]">
              // 07 — Contato
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
              Vamos <span className="text-[var(--color-amber)]">construir</span> seu próximo projeto
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 text-lg text-[var(--color-text-muted)]">
              Conte sobre seu projeto. Respondemos em até 1 dia útil com uma proposta inicial.
            </motion.p>

            <motion.div variants={stagger} className="mt-10 space-y-3">
              <motion.a
                variants={fadeUp}
                href={`mailto:${CONTACT.email}`}
                className="press flex items-center gap-4 p-4 rounded-lg card-base hover:border-[var(--color-amber)]/50"
              >
                <div className="w-11 h-11 rounded-md bg-[var(--color-amber)]/10 flex items-center justify-center text-[var(--color-amber)]">
                  <Mail size={20} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)]">Email</div>
                  <div className="text-[var(--color-text)] font-medium break-all">{CONTACT.email}</div>
                </div>
              </motion.a>

              {CONTACT.team.map((p) => (
                <motion.a
                  key={p.raw}
                  variants={fadeUp}
                  href={`https://wa.me/${p.raw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press flex items-center gap-4 p-4 rounded-lg card-base hover:border-[var(--color-amber)]/50"
                >
                  <div className="w-11 h-11 rounded-md bg-[var(--color-amber)]/10 flex items-center justify-center text-[var(--color-amber)]">
                    <MessageCircle size={20} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)]">
                      WhatsApp · {p.name}
                    </div>
                    <div className="text-[var(--color-text)] font-medium tabular-nums">{p.phone}</div>
                  </div>
                </motion.a>
              ))}

              <motion.a
                variants={fadeUp}
                href={`https://instagram.com/${CONTACT.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="press flex items-center gap-4 p-4 rounded-lg card-base hover:border-[var(--color-amber)]/50"
              >
                <div className="w-11 h-11 rounded-md bg-[var(--color-amber)]/10 flex items-center justify-center text-[var(--color-amber)]">
                  <InstagramIcon size={20} />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)]">Instagram</div>
                  <div className="text-[var(--color-text)] font-medium">@{CONTACT.instagram}</div>
                </div>
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.form
            onSubmit={submit}
            noValidate
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="p-7 sm:p-9 rounded-2xl card-base lg:sticky lg:top-28"
            aria-label="Formulário de contato"
          >
            <motion.h3 variants={fadeUp} className="font-display font-semibold text-2xl mb-1">
              Solicite um orçamento
            </motion.h3>
            <motion.p variants={fadeUp} className="text-sm text-[var(--color-text-muted)] mb-6">
              Sem compromisso. Resposta rápida via WhatsApp.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-4">
              <div>
                <label htmlFor="ct-name" className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">
                  Nome <span className="text-[var(--color-amber)]">*</span>
                </label>
                <input
                  id="ct-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={update("name")}
                  onBlur={onBlur("name")}
                  aria-invalid={!!(errors.name && touched.name)}
                  aria-describedby={errors.name && touched.name ? "ct-name-err" : undefined}
                  className={fieldClass("name")}
                />
                {errors.name && touched.name && (
                  <p id="ct-name-err" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--color-danger)]">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ct-email" className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">
                  Email <span className="text-[var(--color-amber)]">*</span>
                </label>
                <input
                  id="ct-email"
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                  onBlur={onBlur("email")}
                  aria-invalid={!!(errors.email && touched.email)}
                  aria-describedby={errors.email && touched.email ? "ct-email-err" : undefined}
                  className={fieldClass("email")}
                />
                {errors.email && touched.email && (
                  <p id="ct-email-err" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--color-danger)]">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ct-company" className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">
                  Empresa / Instituição
                </label>
                <input
                  id="ct-company"
                  type="text"
                  autoComplete="organization"
                  value={form.company}
                  onChange={update("company")}
                  className={fieldClass("company")}
                />
              </div>

              <div>
                <label htmlFor="ct-message" className="block text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)] mb-1.5">
                  Sua mensagem <span className="text-[var(--color-amber)]">*</span>
                </label>
                <textarea
                  id="ct-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={update("message")}
                  onBlur={onBlur("message")}
                  aria-invalid={!!(errors.message && touched.message)}
                  aria-describedby={errors.message && touched.message ? "ct-message-err" : "ct-message-help"}
                  className={`${fieldClass("message")} py-3 min-h-[120px] resize-none`}
                  placeholder="Tipo de projeto, prazo desejado, localização..."
                />
                {errors.message && touched.message ? (
                  <p id="ct-message-err" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--color-danger)]">
                    <AlertCircle size={12} /> {errors.message}
                  </p>
                ) : (
                  <p id="ct-message-help" className="mt-1.5 text-xs text-[var(--color-text-dim)]">
                    Quanto mais detalhes, melhor a proposta.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sent}
                aria-live="polite"
                className="press w-full min-h-[52px] inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-amber)] text-black font-bold hover:bg-[var(--color-amber-soft)] disabled:bg-[var(--color-success)] disabled:opacity-100 disabled:cursor-default"
              >
                {sent ? (
                  <>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    Abrindo WhatsApp...
                  </>
                ) : (
                  <>
                    Enviar via WhatsApp
                    <Send size={16} aria-hidden="true" />
                  </>
                )}
              </button>

              <p className="text-xs text-[var(--color-text-dim)] text-center">
                Ao enviar, abre uma conversa no WhatsApp da equipe.
              </p>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
