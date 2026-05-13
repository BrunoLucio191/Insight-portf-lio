// ============================================================================
// Rotas: /api/mensagens
// ----------------------------------------------------------------------------
// Endpoints relacionados às mensagens de contato enviadas pelo site:
//
//   POST   /api/mensagens                → público  (visitante envia mensagem)
//   GET    /api/mensagens                → admin    (lista no painel)
//   PATCH  /api/mensagens/:id/responder  → admin    (grava resposta + marca status)
//   DELETE /api/mensagens/:id            → admin    (remove do banco)
//
// Tabela: public.mensagens_contato (ver backend/scripts/mensagens-migration.sql)
//
// Para adicionar campos novos (ex: telefone): crie a coluna na migração,
// adicione no `novaMensagemSchema` e no INSERT abaixo.
// ============================================================================

import { Router } from "express";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { protect } from "../middleware/protect.js";

const router = Router();

// Cliente Supabase lazy — só cria na primeira chamada (evita travar startup
// se as envs ainda não estiverem prontas em algum ambiente de teste).
let _client = null;
function db() {
  if (_client) return _client;
  _client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
  return _client;
}

const TABLE = "mensagens_contato";

// Validação do payload público. Ajuste limites aqui caso o formulário cresça.
const novaMensagemSchema = z.object({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  servico: z.string().trim().max(120).optional().nullable(),
  empresa: z.string().trim().max(200).optional().nullable(),
  mensagem: z.string().trim().min(10).max(4000),
});

// Validação da resposta digitada no painel admin
const respostaSchema = z.object({
  resposta: z.string().trim().min(1).max(4000),
});

// --- Público: visitante envia mensagem pelo ContactSection -------------------
// Sem `protect`: qualquer visitante pode postar. Proteções já em vigor:
// CSRF global (app.js), rate-limit global, validação Zod, RLS no banco.
router.post("/", async (req, res) => {
  const parsed = novaMensagemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
  }
  const payload = {
    ...parsed.data,
    // Normaliza strings vazias → null (mais consistente no banco)
    servico: parsed.data.servico || null,
    empresa: parsed.data.empresa || null,
  };
  const { data, error } = await db().from(TABLE).insert(payload).select("id, created_at").single();
  if (error) return res.status(500).json({ error: error.message });
  // Devolve apenas id+created_at para não vazar dados desnecessários ao público
  res.status(201).json(data);
});

// --- Admin: lista todas as mensagens para o painel ---------------------------
// Ordena primeiro por status (novas antes) e depois por data desc.
router.get("/", protect, async (_req, res) => {
  const { data, error } = await db()
    .from(TABLE)
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// --- Admin: registrar/atualizar a resposta de uma mensagem -------------------
// Marca status como "respondido" e carimba a hora. Pode ser chamado de novo
// para atualizar o texto da resposta — `respondido_em` é sobrescrito.
router.patch("/:id/responder", protect, async (req, res) => {
  const parsed = respostaSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Resposta inválida" });
  }
  const { data, error } = await db()
    .from(TABLE)
    .update({
      resposta: parsed.data.resposta,
      status: "respondido",
      respondido_em: new Date().toISOString(),
    })
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Não encontrado" });
  res.json(data);
});

// --- Admin: remover mensagem do banco ----------------------------------------
router.delete("/:id", protect, async (req, res) => {
  const { error } = await db().from(TABLE).delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

export default router;
