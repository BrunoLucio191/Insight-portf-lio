/**
 * In-memory refresh token store.
 * Troque por Redis em produção para persistência entre restarts e múltiplos processos.
 *
 * Map<jti, { expiresAt: Date }>
 */
const store = new Map();

export const tokenStore = {
  add(jti, expiresAt) {
    store.set(jti, { expiresAt });
  },

  has(jti) {
    const entry = store.get(jti);
    if (!entry) return false;
    if (entry.expiresAt < new Date()) {
      store.delete(jti);
      return false;
    }
    return true;
  },

  revoke(jti) {
    store.delete(jti);
  },

  // Limpeza periódica de tokens expirados
  purgeExpired() {
    const now = new Date();
    for (const [jti, { expiresAt }] of store) {
      if (expiresAt < now) store.delete(jti);
    }
  },
};

// Purge a cada hora
setInterval(() => tokenStore.purgeExpired(), 60 * 60 * 1000);
