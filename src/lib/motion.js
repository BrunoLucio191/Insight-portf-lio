export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeStandard = [0.2, 0, 0, 1];
export const easeEmphasized = [0.8, 0, 0.1, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeStandard } },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: easeOutExpo } },
};

export const pathDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: easeStandard } },
};
