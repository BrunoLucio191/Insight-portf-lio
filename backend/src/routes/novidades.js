import { Router } from "express";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { protect } from "../middleware/protect.js";

const router = Router();

let _client = null;
function db() {
  if (_client) return _client;
  _client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
  return _client;
}

const TABLE = "novidades";

const novidadeSchema = z.object({
  type: z.enum(["Novidade", "Campanha", "Promoção", "Evento"]).default("Novidade"),
  title: z.string().min(1).max(200),
  body: z.string().max(2000).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  video_url: z.string().url().max(500).optional().nullable().or(z.literal("")),
  cta_label: z.string().max(80).optional().nullable(),
  cta_href: z.string().max(500).optional().nullable(),
  active: z.boolean().default(true),
  pinned: z.boolean().default(false),
  expires_at: z.string().datetime().optional().nullable(),
});

// Public list
router.get("/", async (_req, res) => {
  const { data, error } = await db()
    .from(TABLE)
    .select("*")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create (admin)
router.post("/", protect, async (req, res) => {
  const parsed = novidadeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
  const payload = { ...parsed.data, video_url: parsed.data.video_url || null };
  const { data, error } = await db().from(TABLE).insert(payload).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Update (admin)
router.put("/:id", protect, async (req, res) => {
  const parsed = novidadeSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Dados inválidos" });
  const payload = { ...parsed.data, updated_at: new Date().toISOString() };
  if (payload.video_url === "") payload.video_url = null;
  const { data, error } = await db().from(TABLE).update(payload).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Não encontrado" });
  res.json(data);
});

// Delete (admin)
router.delete("/:id", protect, async (req, res) => {
  const { error } = await db().from(TABLE).delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

export default router;
