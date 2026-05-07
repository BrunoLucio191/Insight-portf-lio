import { useEffect, useState, useRef, useCallback } from "react";
import api from "./api";

const IDENTITY = (x) => x;

// Generic CRUD hook for /api/<path>
// fromRow / toRow handle field mapping (snake_case ⇄ camelCase, etc)
export function useResource(path, opts = {}) {
  const fromRowRef = useRef(opts.fromRow || IDENTITY);
  const toRowRef = useRef(opts.toRow || IDENTITY);
  fromRowRef.current = opts.fromRow || IDENTITY;
  toRowRef.current = opts.toRow || IDENTITY;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/${path}`);
      setItems(Array.isArray(data) ? data.map(fromRowRef.current) : data);
      setError(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = async (item) => {
    const { data } = await api.post(`/api/${path}`, toRowRef.current(item));
    const mapped = fromRowRef.current(data);
    setItems((cur) => [mapped, ...cur]);
    return mapped;
  };
  const update = async (id, patch) => {
    const { data } = await api.put(`/api/${path}/${id}`, toRowRef.current(patch));
    const mapped = fromRowRef.current(data);
    setItems((cur) => cur.map((x) => (x.id === id ? mapped : x)));
    return mapped;
  };
  const remove = async (id) => {
    await api.delete(`/api/${path}/${id}`);
    setItems((cur) => cur.filter((x) => x.id !== id));
  };

  return { items, loading, error, refresh, create, update, remove };
}

// Singleton (site_meta)
export function useSingleton(path, opts = {}) {
  const fromRowRef = useRef(opts.fromRow || IDENTITY);
  const toRowRef = useRef(opts.toRow || IDENTITY);
  fromRowRef.current = opts.fromRow || IDENTITY;
  toRowRef.current = opts.toRow || IDENTITY;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data: row } = await api.get(`/api/${path}`);
      setData(fromRowRef.current(row));
      setError(null);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => { refresh(); }, [refresh]);

  const save = async (patch) => {
    const { data: row } = await api.put(`/api/${path}`, toRowRef.current(patch));
    const mapped = fromRowRef.current(row);
    setData(mapped);
    return mapped;
  };

  return { data, loading, error, refresh, save };
}
