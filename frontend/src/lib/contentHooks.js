import { useResource, useSingleton } from "./useResource";

export const useAvisos = () => useResource("avisos");

const projetoFrom = (r) => ({
  id: r.id, client: r.client || "", sector: r.sector || "", type: r.type || "Projeto",
  title: r.title, outcome: r.outcome || "", metric: r.metric || "",
  image: r.image || "", year: r.year, sort_order: r.sort_order ?? 0,
});
const projetoTo = (n) => ({
  client: n.client || null, sector: n.sector || null, type: n.type || null,
  title: n.title, outcome: n.outcome || null, metric: n.metric || null,
  image: n.image || null, year: n.year || null, sort_order: n.sort_order ?? 0,
});
export const useProjetos = () => useResource("projetos", { fromRow: projetoFrom, toRow: projetoTo });

const heroFrom = (r) => ({ id: r.id, caption: r.caption || "", image: r.image, sort_order: r.sort_order ?? 0 });
const heroTo = (n) => ({ caption: n.caption || null, image: n.image, sort_order: n.sort_order ?? 0 });
export const useHeroSlides = () => useResource("hero-slides", { fromRow: heroFrom, toRow: heroTo });

const servicoFrom = (r) => ({ id: r.id, title: r.title, desc: r.description || "", detail: r.detail || "", iconKey: r.icon_key, sort_order: r.sort_order ?? 0 });
const servicoTo = (n) => ({ title: n.title, description: n.desc || null, detail: n.detail || null, icon_key: n.iconKey || "zap", sort_order: n.sort_order ?? 0 });
export const useServicos = () => useResource("servicos", { fromRow: servicoFrom, toRow: servicoTo });

const siteFrom = (r) => ({ heroTitle: r?.hero_title || "", heroSubtitle: r?.hero_subtitle || "", heroBadge: r?.hero_badge || "" });
const siteTo = (n) => ({ hero_title: n.heroTitle || null, hero_subtitle: n.heroSubtitle || null, hero_badge: n.heroBadge || null });
export const useSiteMeta = () => useSingleton("site-meta", { fromRow: siteFrom, toRow: siteTo });
