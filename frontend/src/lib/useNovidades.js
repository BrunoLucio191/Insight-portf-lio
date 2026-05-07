import { useEffect, useState, useCallback } from "react";
import { novidadesApi } from "./api";

// DB row → UI shape (camelCase + cta object)
function fromRow(r) {
  return {
    id: r.id,
    type: r.type,
    title: r.title,
    body: r.body || "",
    image: r.image || "",
    videoUrl: r.video_url || "",
    cta: { label: r.cta_label || "", href: r.cta_href || "" },
    active: r.active,
    pinned: r.pinned,
    expiresAt: r.expires_at,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
  };
}

// UI shape → DB row
function toRow(n) {
  return {
    type: n.type,
    title: n.title,
    body: n.body || null,
    image: n.image || null,
    video_url: n.videoUrl || null,
    cta_label: n.cta?.label || null,
    cta_href: n.cta?.href || null,
    active: !!n.active,
    pinned: !!n.pinned,
    expires_at: n.expiresAt || null,
  };
}

export function useNovidades() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await novidadesApi.list();
      setItems(rows.map(fromRow));
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (n) => {
    const row = await novidadesApi.create(toRow(n));
    setItems((cur) => [fromRow(row), ...cur]);
    return fromRow(row);
  };
  const update = async (id, patch) => {
    const row = await novidadesApi.update(id, toRow(patch));
    setItems((cur) => cur.map((x) => (x.id === id ? fromRow(row) : x)));
    return fromRow(row);
  };
  const remove = async (id) => {
    await novidadesApi.remove(id);
    setItems((cur) => cur.filter((x) => x.id !== id));
  };

  return { items, loading, error, refresh, create, update, remove };
}
