// Gerenciamento de estado global do site.
// Usa localStorage como banco de dados simples — sem backend, sem Redux.
// Qualquer alteração dispara o evento "insight:store", que sincroniza
// todos os componentes abertos (inclusive outras abas via evento "storage").
import { useEffect, useState } from "react";
import { PORTFOLIO as SEED_PORTFOLIO, SERVICES as SEED_SERVICES } from "./data";

// Chave do localStorage — mudar aqui reseta todos os dados salvos dos usuários.
const KEY = "insight_site_v1";

// Dados padrão do site — usados quando localStorage está vazio ou corrompido.
// Para alterar o conteúdo inicial, edite aqui (projetos, serviços, hero, etc.).
const SEED = {
  announcements: [
    {
      id: "a1",
      title: "Novo escopo aberto",
      body: "Estamos abrindo orçamentos para projetos elétricos no 2º semestre.",
      level: "info",
      active: true,
      createdAt: Date.now(),
    },
  ],
  projects: SEED_PORTFOLIO.map((p, i) => ({
    id: `p${i + 1}`,
    client: p.client,
    sector: p.sector,
    type: p.type,
    title: p.title,
    outcome: p.outcome,
    metric: p.metric,
    image: "",
    year: 2024,
  })),
  services: SEED_SERVICES.map((s, i) => ({
    id: `s${i + 1}`,
    title: s.title,
    desc: s.desc,
    detail: s.detail,
    iconKey: ["zap", "clipboard", "cpu", "gauge", "ruler", "sun"][i] || "zap",
  })),
  site: {
    heroTitle: "Engenharia elétrica com precisão júnior",
    heroSubtitle:
      "Projetos elétricos, automação e eficiência energética com a qualidade técnica da UFMA e o preço justo de uma empresa júnior.",
    heroBadge: "Empresa Júnior · UFMA · desde 2017",
  },
  novidades: [
    {
      id: "nv1",
      type: "Novidade",
      title: "Prêmio MAJU 2025",
      body: "A Insight foi premiada no MAJU 2025 como destaque em engenharia júnior. Obrigado a todos os clientes e parceiros!",
      image: "",
      cta: { label: "Saiba mais", href: "#contato" },
      active: true,
      pinned: true,
      expiresAt: null,
      createdAt: Date.now(),
    },
    {
      id: "nv2",
      type: "Campanha",
      title: "Orçamentos abertos — 2º semestre",
      body: "Estamos aceitando novos projetos elétricos, laudos e automação para o 2º semestre de 2025.",
      image: "",
      cta: { label: "Solicitar orçamento", href: "#contato" },
      active: true,
      pinned: false,
      expiresAt: null,
      createdAt: Date.now(),
    },
  ],
  heroSlides: [
    {
      id: "h1",
      caption: "Projetos elétricos sob normas técnicas",
      image: "https://images.unsplash.com/photo-1605002123423-0eb5d4f01c6e?auto=format&fit=crop&w=1600&q=80",
    },
    {
      id: "h2",
      caption: "Automação industrial e residencial",
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1600&q=80",
    },
    {
      id: "h3",
      caption: "Eficiência energética e energia solar",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80",
    },
  ],
};

// Lê o estado do localStorage, mesclando com SEED para garantir que
// campos novos adicionados ao código apareçam mesmo em dados antigos.
function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    return { ...SEED, ...JSON.parse(raw) };
  } catch {
    return SEED;
  }
}

// Salva o estado e notifica todos os listeners.
// O evento "insight:store" é o mecanismo que faz os componentes re-renderizarem.
function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("insight:store"));
}

export const store = {
  get: read,
  set: write,
  reset: () => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("insight:store"));
  },
};

// Hook React que mantém qualquer componente sincronizado com o store.
// Escuta mudanças desta aba ("insight:store") e de outras abas ("storage").
export function useStore() {
  const [state, setState] = useState(read);
  useEffect(() => {
    const sync = () => setState(read());
    window.addEventListener("insight:store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("insight:store", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return state;
}

// Gera um ID curto aleatório para novos itens (avisos, projetos, slides).
export function uid() {
  return Math.random().toString(36).slice(2, 9);
}
