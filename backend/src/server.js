import dotenv from "dotenv";
dotenv.config();

const REQUIRED = ["JWT_SECRET", "JWT_REFRESH_SECRET", "CSRF_SECRET", "ADMIN_PASS_HASH"];
const missing = REQUIRED.filter((k) => !process.env[k] || process.env[k].length < 16);

if (missing.length > 0) {
  console.error(`\n[FATAL] Variáveis de ambiente ausentes ou fracas: ${missing.join(", ")}`);
  console.error("Rode: npm run setup\n");
  process.exit(1);
}

const { default: app } = await import("./app.js");
const { default: logger } = await import("./lib/logger.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV }, "Server iniciado");
});
