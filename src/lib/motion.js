// Variantes e curvas de animação compartilhadas do site.
// Importe aqui em vez de redefinir em cada componente.

// Curvas bezier — controlam o "feeling" das animações.
// easeOutExpo: entrada rápida com final suave (mais expressivo).
// easeStandard: transição neutra do Material Design.
// easeEmphasized: saída abrupta com frenagem (usado em modais e destaque).
export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeStandard = [0.2, 0, 0, 1];
export const easeEmphasized = [0.8, 0, 0.1, 1];

// Sobe e aparece — usado nos títulos e parágrafos de seção.
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
};

// Container que atrasa cada filho 0.1s — cria o efeito cascata nas listas.
// Use como variants no elemento pai, e fadeUp/fadeIn nos filhos.
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeStandard } },
};

// Cresce levemente ao entrar — bom para cards e imagens.
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: easeOutExpo } },
};

// Anima o traçado de um <path> SVG do zero ao completo — efeito "desenho".
export const pathDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: easeStandard } },
};
