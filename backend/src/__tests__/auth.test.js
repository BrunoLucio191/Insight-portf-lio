import request from "supertest";
import bcrypt from "bcryptjs";
import { jest } from "@jest/globals";

// Setup env antes de importar o app
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_secret_32_chars_minimum_xxxx";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret_32_chars_xxx";
process.env.CSRF_SECRET = "test_csrf_secret_32_chars_xxxxxxx";
process.env.ADMIN_PASS_HASH = await bcrypt.hash("senha_correta", 10);
process.env.ALLOWED_ORIGINS = "http://localhost:5173";

const { default: app } = await import("../app.js");

describe("POST /api/auth/admin — login", () => {
  let csrfToken, csrfCookie;

  beforeEach(async () => {
    const res = await request(app).get("/api/csrf-token");
    csrfToken = res.body.csrfToken;
    csrfCookie = res.headers["set-cookie"];
  });

  it("login com senha correta retorna 200 e seta cookies", async () => {
    const res = await request(app)
      .post("/api/auth/admin")
      .set("Cookie", csrfCookie)
      .set("x-csrf-token", csrfToken)
      .send({ password: "senha_correta" });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    const cookies = res.headers["set-cookie"].join(";");
    expect(cookies).toContain("token=");
    expect(cookies).toContain("HttpOnly");
  });

  it("senha errada retorna 401 com mensagem genérica", async () => {
    const res = await request(app)
      .post("/api/auth/admin")
      .set("Cookie", csrfCookie)
      .set("x-csrf-token", csrfToken)
      .send({ password: "senha_errada" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Credenciais inválidas.");
  });

  it("body vazio retorna 400 (validação Zod)", async () => {
    const res = await request(app)
      .post("/api/auth/admin")
      .set("Cookie", csrfCookie)
      .set("x-csrf-token", csrfToken)
      .send({});

    expect(res.status).toBe(400);
  });

  it("sem CSRF token retorna 403", async () => {
    const res = await request(app)
      .post("/api/auth/admin")
      .send({ password: "senha_correta" });

    expect(res.status).toBe(403);
  });

  it("NoSQL injection — { $ne: null } é bloqueado pelo Zod (não é string)", async () => {
    const res = await request(app)
      .post("/api/auth/admin")
      .set("Cookie", csrfCookie)
      .set("x-csrf-token", csrfToken)
      .send({ password: { $ne: null } });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/auth/me — proteção de rota", () => {
  it("sem token retorna 401", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("JWT forjado (alg:none) retorna 401", async () => {
    const fakeHeader = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const fakePayload = Buffer.from(JSON.stringify({ sub: "admin", role: "admin" })).toString("base64url");
    const fakeToken = `${fakeHeader}.${fakePayload}.`;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `token=${fakeToken}`);

    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("limpa cookies", async () => {
    const csrfRes = await request(app).get("/api/csrf-token");
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", csrfRes.headers["set-cookie"])
      .set("x-csrf-token", csrfRes.body.csrfToken);

    expect(res.status).toBe(200);
  });
});

describe("GET /healthz", () => {
  it("retorna 200", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
