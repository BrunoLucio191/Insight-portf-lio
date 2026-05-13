import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "";

const api = axios.create({ baseURL: BASE, withCredentials: true });

let csrfToken = null;

async function getCsrf() {
  if (csrfToken) return csrfToken;
  const { data } = await api.get("/api/csrf-token");
  csrfToken = data.csrfToken;
  return csrfToken;
}

api.interceptors.request.use(async (config) => {
  const mutating = ["post", "put", "patch", "delete"];
  if (mutating.includes(config.method)) {
    config.headers["x-csrf-token"] = await getCsrf();
  }
  return config;
});

let refreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry && !refreshing) {
      original._retry = true;
      refreshing = true;
      try {
        await axios.post(`${BASE}/api/auth/refresh`, null, { withCredentials: true });
        refreshing = false;
        return api(original);
      } catch {
        refreshing = false;
        return Promise.reject(err);
      }
    }
    if (err.response?.status === 403) {
      csrfToken = null;
    }
    return Promise.reject(err);
  },
);

export async function uploadImage(file) {
  const { data } = await api.post("/api/upload/sign-image", {
    contentType: file.type,
    size: file.size,
  });
  const put = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type, "x-upsert": "false" },
    body: file,
  });
  if (!put.ok) throw new Error(`Upload falhou: ${put.status}`);
  return data.key;
}

const KEY_RE = /^images\/[A-Za-z0-9._-]+$/;
const cache = new Map();
const TTL_MS = 50 * 60 * 1000;

export function isStorageKey(v) {
  return typeof v === "string" && KEY_RE.test(v);
}

export async function resolveImage(keyOrUrl) {
  if (!keyOrUrl) return "";
  if (!isStorageKey(keyOrUrl)) return keyOrUrl;
  const hit = cache.get(keyOrUrl);
  const now = Date.now();
  if (hit && hit.exp > now) return hit.url;
  const { data } = await api.post("/api/upload/sign-download", { key: keyOrUrl });
  cache.set(keyOrUrl, { url: data.url, exp: now + TTL_MS });
  return data.url;
}

// Novidades CRUD
export const novidadesApi = {
  list: () => api.get("/api/novidades").then((r) => r.data),
  create: (n) => api.post("/api/novidades", n).then((r) => r.data),
  update: (id, n) => api.put(`/api/novidades/${id}`, n).then((r) => r.data),
  remove: (id) => api.delete(`/api/novidades/${id}`).then((r) => r.data),
};

// ---------------------------------------------------------------------------
// Mensagens de contato (formulário público + painel admin)
//   - enviar:    chamado pelo ContactSection (público, sem login)
//   - list:      usado pela aba "Mensagens" do painel admin
//   - responder: grava a resposta e marca como respondida
//   - remove:    apaga a mensagem do banco
// ---------------------------------------------------------------------------
export const mensagensApi = {
  enviar: (payload) => api.post("/api/mensagens", payload).then((r) => r.data),
  list: () => api.get("/api/mensagens").then((r) => r.data),
  responder: (id, resposta) =>
    api.patch(`/api/mensagens/${id}/responder`, { resposta }).then((r) => r.data),
  remove: (id) => api.delete(`/api/mensagens/${id}`).then((r) => r.data),
};

export default api;
