import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const REQUIRED = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY", "SUPABASE_BUCKET"];

export const storageConfigured = REQUIRED.every((k) => process.env[k]);

let client = null;
function getClient() {
  if (client) return client;
  if (!storageConfigured) throw new Error("Supabase Storage não configurado");
  client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
  return client;
}

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_IMAGE = 10 * 1024 * 1024;
const DOWNLOAD_TTL = 60 * 60; // 1h

export const limits = { ALLOWED_IMAGE, MAX_IMAGE };

export async function presignImage({ contentType, size }) {
  if (!ALLOWED_IMAGE.includes(contentType)) {
    throw new Error("Tipo de imagem não permitido");
  }
  if (size > MAX_IMAGE) {
    throw new Error("Imagem maior que 10MB");
  }

  const ext = contentType.split("/")[1].replace("jpeg", "jpg");
  const key = `images/${randomUUID()}.${ext}`;
  const bucket = process.env.SUPABASE_BUCKET;

  const supabase = getClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(key);
  if (error) throw new Error(error.message);

  return {
    uploadUrl: data.signedUrl,
    token: data.token,
    key,
  };
}

export async function signedDownload(key) {
  if (typeof key !== "string" || !key.startsWith("images/")) {
    throw new Error("Key inválida");
  }
  const bucket = process.env.SUPABASE_BUCKET;
  const supabase = getClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(key, DOWNLOAD_TTL);
  if (error) throw new Error(error.message);
  return { url: data.signedUrl, expiresIn: DOWNLOAD_TTL };
}
