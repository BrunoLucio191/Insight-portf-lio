#!/usr/bin/env node
import { randomBytes } from "crypto";
import { existsSync, readFileSync, writeFileSync, copyFileSync } from "fs";
import { createInterface } from "readline";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcryptjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env");
const ENV_EXAMPLE = join(ROOT, ".env.example");

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

const askHidden = (q) => new Promise((res) => {
  process.stdout.write(q);
  process.stdin.setRawMode(true);
  let buf = "";
  const onData = (ch) => {
    const code = ch[0];
    if (code === 0x0a || code === 0x0d) {
      process.stdin.setRawMode(false);
      process.stdin.removeListener("data", onData);
      process.stdout.write("\n");
      res(buf);
    } else if (code === 0x03) {
      process.exit(1);
    } else if (code === 0x7f || code === 0x08) {
      if (buf.length > 0) {
        buf = buf.slice(0, -1);
        process.stdout.write("\b \b");
      }
    } else {
      buf += ch.toString();
      process.stdout.write("*");
    }
  };
  process.stdin.on("data", onData);
});

const hex = (bytes) => randomBytes(bytes).toString("hex");

async function main() {
  console.log("\n=== Setup .env Insight backend ===\n");

  if (existsSync(ENV_PATH)) {
    const ans = await ask(".env já existe. Sobrescrever? (s/N): ");
    if (ans.toLowerCase() !== "s") {
      console.log("Cancelado.");
      rl.close();
      return;
    }
  }

  copyFileSync(ENV_EXAMPLE, ENV_PATH);
  let env = readFileSync(ENV_PATH, "utf8");

  const password = await askHidden("Senha admin (mín 12 chars): ");
  rl.close();

  if (password.length < 12) {
    console.error("Senha curta demais. Abortado.");
    process.exit(1);
  }

  console.log("Gerando hash bcrypt (cost 12)...");
  const hash = await bcrypt.hash(password, 12);

  const replacements = {
    JWT_SECRET: hex(64),
    JWT_REFRESH_SECRET: hex(64),
    CSRF_SECRET: hex(64),
    ADMIN_PASS_HASH: hash,
  };

  for (const [k, v] of Object.entries(replacements)) {
    env = env.replace(new RegExp(`^${k}=.*$`, "m"), `${k}=${v}`);
  }

  writeFileSync(ENV_PATH, env, { mode: 0o600 });
  console.log(`\n.env gerado em ${ENV_PATH} (chmod 600).`);
  console.log("Segredos: 64 bytes hex. Hash bcrypt cost 12.");
  console.log("NAO commitar .env.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
