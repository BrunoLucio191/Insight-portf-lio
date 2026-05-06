import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { protect } from "../middleware/protect.js";
import { auditLog } from "../lib/logger.js";
import { tokenStore } from "../lib/tokenStore.js";

const router = express.Router();

// Rate limit específico para login — 10 tentativas/15min por IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Muitas tentativas de login. Tente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

const IS_PROD = process.env.NODE_ENV === "production";

const accessCookieOptions = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 minutos
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict",
  path: "/api/auth/refresh", // cookie só vai nessa rota
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
};

const loginSchema = z.object({
  password: z.string().min(1).max(128),
});

const issueTokens = (res) => {
  const accessJti = randomUUID();
  const refreshJti = randomUUID();

  const accessToken = jwt.sign(
    { sub: "admin", role: "admin", jti: accessJti },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { sub: "admin", jti: refreshJti },
    process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET + "_refresh",
    { algorithm: "HS256", expiresIn: "7d" },
  );

  // Registra refresh JTI como válido (permite revogação)
  tokenStore.add(refreshJti, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  res.cookie("token", accessToken, accessCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshCookieOptions);

  return { accessJti, refreshJti };
};

// Login
router.post("/admin", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  const { password } = parsed.data;
  const hash = process.env.ADMIN_PASS_HASH;

  if (!hash) {
    auditLog.error("ADMIN_PASS_HASH não configurado");
    return res.status(500).json({ error: "Servidor mal configurado." });
  }

  const valid = await bcrypt.compare(password, hash);

  if (!valid) {
    auditLog.warn(
      { ip: req.ip, ua: req.get("user-agent"), event: "login_failed" },
      "Tentativa de login falhou",
    );
    // Mesma mensagem para senha errada e hash ausente — evita user enumeration
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  issueTokens(res);

  auditLog.info(
    { ip: req.ip, ua: req.get("user-agent"), event: "login_success" },
    "Login admin bem-sucedido",
  );

  res.json({ message: "Autenticado com sucesso." });
});

// Refresh — troca refresh token por novo par de tokens (rotation)
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token ausente." });
  }

  try {
    const secret =
      process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET + "_refresh";

    const decoded = jwt.verify(refreshToken, secret, {
      algorithms: ["HS256"],
    });

    // Verifica se JTI ainda está válido (não foi revogado)
    if (!tokenStore.has(decoded.jti)) {
      auditLog.warn(
        { ip: req.ip, jti: decoded.jti, event: "refresh_revoked" },
        "Tentativa de uso de refresh token revogado",
      );
      return res.status(401).json({ error: "Token inválido." });
    }

    // Revoga o refresh token usado (rotation — cada refresh gera novo par)
    tokenStore.revoke(decoded.jti);

    issueTokens(res);

    auditLog.info(
      { ip: req.ip, event: "token_refreshed" },
      "Tokens renovados",
    );

    res.json({ message: "Tokens renovados." });
  } catch {
    return res.status(401).json({ error: "Refresh token inválido ou expirado." });
  }
});

// Logout
router.post("/logout", (req, res) => {
  // Revogar refresh token se presente
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      const secret =
        process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET + "_refresh";
      const decoded = jwt.verify(refreshToken, secret, {
        algorithms: ["HS256"],
      });
      tokenStore.revoke(decoded.jti);
    }
  } catch {
    // Token já expirado ou inválido — não importa, limpar cookies de qualquer forma
  }

  res.clearCookie("token", accessCookieOptions);
  res.clearCookie("refresh_token", { ...refreshCookieOptions });

  auditLog.info({ ip: req.ip, event: "logout" }, "Logout realizado");

  res.json({ message: "Logout realizado." });
});

// Verificar autenticação
router.get("/me", protect, (req, res) => {
  res.json({ message: "authenticated" });
});

export default router;
