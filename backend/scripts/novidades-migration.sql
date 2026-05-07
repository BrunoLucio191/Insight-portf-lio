-- Migração: tabela novidades
-- Rode no SQL Editor do Supabase Dashboard

CREATE TABLE IF NOT EXISTS public.novidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'Novidade' CHECK (type IN ('Novidade','Campanha','Promoção','Evento')),
  title text NOT NULL,
  body text,
  image text,
  video_url text,
  cta_label text,
  cta_href text,
  active boolean NOT NULL DEFAULT true,
  pinned boolean NOT NULL DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS novidades_active_idx
  ON public.novidades (active, pinned, created_at DESC);

ALTER TABLE public.novidades ENABLE ROW LEVEL SECURITY;

-- Leitura pública (frontend lê direto)
DROP POLICY IF EXISTS "novidades_public_read" ON public.novidades;
CREATE POLICY "novidades_public_read" ON public.novidades
  FOR SELECT USING (true);

-- Escrita apenas via service_role (backend)
-- service_role bypassa RLS automaticamente, não precisa policy
