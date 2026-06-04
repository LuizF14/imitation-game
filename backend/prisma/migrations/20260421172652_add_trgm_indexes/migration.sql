-- Habilita a extensão (caso não tenha feito via schema)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índices GIN nas colunas desejadas (ajuste para sua tabela/colunas)
CREATE INDEX IF NOT EXISTS idx_ai_models_name_trgm
  ON "AIModel" USING GIN (name gin_trgm_ops);