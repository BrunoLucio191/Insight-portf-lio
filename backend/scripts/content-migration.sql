-- Migração: tabelas de conteúdo do site
-- Rode no SQL Editor do Supabase Dashboard

-- ============ AVISOS ============
CREATE TABLE IF NOT EXISTS public.avisos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  level text NOT NULL DEFAULT 'info' CHECK (level IN ('info','warning','success')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "avisos_public_read" ON public.avisos;
CREATE POLICY "avisos_public_read" ON public.avisos FOR SELECT USING (true);

-- ============ PROJETOS ============
CREATE TABLE IF NOT EXISTS public.projetos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client text,
  sector text,
  type text,
  title text NOT NULL,
  outcome text,
  metric text,
  image text,
  year int,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS projetos_sort_idx ON public.projetos (sort_order, created_at DESC);
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projetos_public_read" ON public.projetos;
CREATE POLICY "projetos_public_read" ON public.projetos FOR SELECT USING (true);

-- ============ HERO SLIDES ============
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caption text,
  image text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS hero_slides_sort_idx ON public.hero_slides (sort_order);
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "hero_slides_public_read" ON public.hero_slides;
CREATE POLICY "hero_slides_public_read" ON public.hero_slides FOR SELECT USING (true);

-- ============ SERVICOS ============
CREATE TABLE IF NOT EXISTS public.servicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  detail text,
  icon_key text NOT NULL DEFAULT 'zap',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS servicos_sort_idx ON public.servicos (sort_order);
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "servicos_public_read" ON public.servicos;
CREATE POLICY "servicos_public_read" ON public.servicos FOR SELECT USING (true);

-- ============ SITE META (singleton) ============
CREATE TABLE IF NOT EXISTS public.site_meta (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_title text,
  hero_subtitle text,
  hero_badge text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_meta ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_meta_public_read" ON public.site_meta;
CREATE POLICY "site_meta_public_read" ON public.site_meta FOR SELECT USING (true);
INSERT INTO public.site_meta (id, hero_title, hero_subtitle, hero_badge)
VALUES (1,
  'Engenharia elétrica com precisão júnior',
  'Projetos elétricos, automação e eficiência energética com a qualidade técnica da UFMA e o preço justo de uma empresa júnior.',
  'Empresa Júnior · UFMA · desde 2017')
ON CONFLICT (id) DO NOTHING;
