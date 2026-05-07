import express from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { protect } from "../middleware/protect.js";
import { presignImage, signedDownload, limits, storageConfigured } from "../lib/supabase.js";
import { auditLog } from "../lib/logger.js";

const router = express.Router();

const IS_PROD = process.env.NODE_ENV === "production";
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: IS_PROD ? 30 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !IS_PROD,
});

const signSchema = z.object({
  contentType: z.string().min(1).max(64),
  size: z.number().int().positive().max(limits.MAX_IMAGE),
}).strict();

router.post("/sign-image", protect, uploadLimiter, async (req, res) => {
  if (!storageConfigured) {
    return res.status(503).json({ error: "Storage não configurado." });
  }
  const parsed = signSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos." });
  }
  try {
    const result = await presignImage(parsed.data);
    auditLog.info({ user: req.user?.sub, key: result.key, event: "upload_signed" }, "Upload assinado");
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const downloadSchema = z.object({
  key: z.string().min(1).max(256).regex(/^images\/[A-Za-z0-9._-]+$/),
}).strict();

router.post("/sign-download", protect, uploadLimiter, async (req, res) => {
  if (!storageConfigured) {
    return res.status(503).json({ error: "Storage não configurado." });
  }
  const parsed = downloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos." });
  }
  try {
    const result = await signedDownload(parsed.data.key);
    auditLog.info({ user: req.user?.sub, key: parsed.data.key, event: "download_signed" }, "Download assinado");
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
