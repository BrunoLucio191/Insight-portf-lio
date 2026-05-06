import "./lib/hardening.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import compression from "compression";
import { pinoHttp } from "pino-http";
import { doubleCsrf } from "csrf-csrf";
import authRoutes from "./routes/auth.admin.js";
import logger from "./lib/logger.js";

const IS_PROD = process.env.NODE_ENV === "production";
const app = express();

if (IS_PROD) app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "frame-ancestors": ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "same-site" },
    hsts: IS_PROD
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
    referrerPolicy: { policy: "no-referrer" },
  }),
);

if (IS_PROD) {
  app.use((req, res, next) => {
    if (req.secure || req.get("x-forwarded-proto") === "https") return next();
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
}

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error("CORS: origem não permitida"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use(
  pinoHttp({
    logger,
    redact: ["req.headers.cookie", "req.headers.authorization"],
    customLogLevel: (_req, res) => (res.statusCode >= 500 ? "error" : "info"),
  }),
);

app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET ?? process.env.JWT_SECRET,
  // v4 requer getSessionIdentifier — usa IP como identificador sem sessão
  getSessionIdentifier: (req) => req.ip ?? "anon",
  // __Host- prefix exige Secure=true; em dev/test usar nome simples
  cookieName: IS_PROD ? "__Host-csrf" : "csrf",
  cookieOptions: {
    sameSite: "strict",
    secure: IS_PROD,
    httpOnly: true,
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: generateCsrfToken(req, res) });
});

app.use(doubleCsrfProtection);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Muitas requisições, tente novamente mais tarde." },
  }),
);

app.use("/api/auth", authRoutes);

app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.use((err, req, res, _next) => {
  const status = err.status ?? err.statusCode ?? 500;
  req.log?.error({ err }, "Unhandled error");
  res.status(status).json({
    error: IS_PROD ? "Erro interno." : err.message,
  });
});

export default app;
