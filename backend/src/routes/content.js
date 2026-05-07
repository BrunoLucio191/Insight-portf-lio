import { Router } from "express";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { protect } from "../middleware/protect.js";

let _client = null;
function db() {
  if (_client) return _client;
  _client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
  return _client;
}

// ============ Schemas ============
const avisoSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().max(1000).optional().nullable(),
  level: z.enum(["info", "warning", "success"]).default("info"),
  active: z.boolean().default(true),
});

const projetoSchema = z.object({
  client: z.string().max(120).optional().nullable(),
  sector: z.string().max(120).optional().nullable(),
  type: z.string().max(60).optional().nullable(),
  title: z.string().min(1).max(200),
  outcome: z.string().max(2000).optional().nullable(),
  metric: z.string().max(120).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  year: z.number().int().optional().nullable(),
  sort_order: z.number().int().default(0),
});

const heroSlideSchema = z.object({
  caption: z.string().max(200).optional().nullable(),
  image: z.string().max(500).optional().nullable().default(""),
  sort_order: z.number().int().default(0),
});

const servicoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional().nullable(),
  detail: z.string().max(2000).optional().nullable(),
  icon_key: z.string().max(40).default("zap"),
  sort_order: z.number().int().default(0),
});

const siteMetaSchema = z.object({
  hero_title: z.string().max(200).optional().nullable(),
  hero_subtitle: z.string().max(500).optional().nullable(),
  hero_badge: z.string().max(120).optional().nullable(),
});

// ============ CRUD factory ============
function makeCrud({ table, schema, defaultOrder = "created_at", defaultDir = "desc" }) {
  const r = Router();

  r.get("/", async (_req, res) => {
    const { data, error } = await db().from(table).select("*").order(defaultOrder, { ascending: defaultDir === "asc" });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  r.post("/", protect, async (req, res) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    const { data, error } = await db().from(table).insert(parsed.data).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  });

  r.put("/:id", protect, async (req, res) => {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos" });
    const payload = { ...parsed.data, updated_at: new Date().toISOString() };
    const { data, error } = await db().from(table).update(payload).eq("id", req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Não encontrado" });
    res.json(data);
  });

  r.delete("/:id", protect, async (req, res) => {
    const { error } = await db().from(table).delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).end();
  });

  return r;
}

export const avisosRouter = makeCrud({ table: "avisos", schema: avisoSchema });
export const projetosRouter = makeCrud({ table: "projetos", schema: projetoSchema, defaultOrder: "sort_order", defaultDir: "asc" });
export const heroSlidesRouter = makeCrud({ table: "hero_slides", schema: heroSlideSchema, defaultOrder: "sort_order", defaultDir: "asc" });
export const servicosRouter = makeCrud({ table: "servicos", schema: servicoSchema, defaultOrder: "sort_order", defaultDir: "asc" });

// site_meta singleton
export const siteMetaRouter = (() => {
  const r = Router();
  r.get("/", async (_req, res) => {
    const { data, error } = await db().from("site_meta").select("*").eq("id", 1).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });
  r.put("/", protect, async (req, res) => {
    const parsed = siteMetaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos" });
    const payload = { ...parsed.data, id: 1, updated_at: new Date().toISOString() };
    const { data, error } = await db().from("site_meta").upsert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });
  return r;
})();
