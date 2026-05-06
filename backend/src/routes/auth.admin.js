import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { protect } from "../middleware/protect.js";

const router = express.Router();

// Rate limit específico para login — máx 10 tentativas/15min por IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Muitas tentativas de login. Tente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

const loginSchema = z.object({
  password: z.string().min(1).max(128),
});

// crypto.randomUUID() é criptograficamente seguro, ao contrário de Math.random()
const generateToken = () =>
  jwt.sign({ jti: randomUUID() }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1d",
  });

router.post("/admin", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  const { password } = parsed.data;
  const hash = process.env.ADMIN_PASS_HASH;

  if (!hash) {
    return res.status(500).json({ error: "Servidor mal configurado." });
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    // Mesma mensagem para senha errada e usuário inexistente — evita user enumeration
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const token = generateToken();
  res.cookie("token", token, cookieOptions);
  res.json({ message: "Autenticado com sucesso." });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
  res.json({ message: "Logout realizado." });
});

router.get("/me", protect, (req, res) => {
  res.json({ message: "authenticated" });
});

export default router;
