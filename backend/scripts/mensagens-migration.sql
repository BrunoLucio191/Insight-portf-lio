-- ============================================================================
-- Migração: tabela mensagens_contato
-- ----------------------------------------------------------------------------
-- Guarda as mensagens enviadas pelo formulário público de contato (site)
-- e exibidas/respondidas no painel administrativo.
--
-- Como rodar: Supabase Dashboard → SQL Editor → cole este arquivo e execute.
-- Pode rodar mais de uma vez sem perigo (usamos IF NOT EXISTS).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.mensagens_contato (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dados que o visitante preenche no formulário do site
  nome text NOT NULL,
  email text NOT NULL,
  servico text,         -- opcional: título do serviço selecionado no <select>
  empresa text,         -- opcional
  mensagem text NOT NULL,

  -- Controle do atendimento pelo admin
  -- "novo" = ainda não respondida | "respondido" = admin já registrou resposta
  status text NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','respondido')),
  resposta text,                 -- texto da resposta digitada no painel
  respondido_em timestamptz,     -- preenchido automaticamente quando responde

  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índice para acelerar a listagem do painel (ordena por status + data)
CREATE INDEX IF NOT EXISTS mensagens_contato_status_idx
  ON public.mensagens_contato (status, created_at DESC);

-- RLS ligado por segurança. O backend usa SUPABASE_SERVICE_KEY (service_role),
-- que ignora RLS automaticamente, então nenhuma policy adicional é necessária.
-- Se algum dia for ler direto do frontend público, crie policies aqui.
ALTER TABLE public.mensagens_contato ENABLE ROW LEVEL SECURITY;
