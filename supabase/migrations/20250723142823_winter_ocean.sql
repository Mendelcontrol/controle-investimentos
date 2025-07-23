/*
  # Criar tabelas para controle de investimentos

  1. Novas Tabelas
    - `daily_config`
      - `id` (uuid, primary key)
      - `date` (date, unique)
      - `initial_balance` (numeric)
      - `current_balance` (numeric)
      - `daily_profit` (numeric)
      - `operations_count` (integer)
      - `consecutive_losses` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `operations`
      - `id` (uuid, primary key)
      - `date` (date)
      - `value` (numeric)
      - `type` (text)
      - `result` (numeric)
      - `balance` (numeric)
      - `created_at` (timestamp)

  2. Segurança
    - Habilitar RLS em ambas as tabelas
    - Adicionar políticas para permitir todas as operações (público)
*/

-- Criar tabela de configuração diária
CREATE TABLE IF NOT EXISTS daily_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  initial_balance numeric DEFAULT 50.00,
  current_balance numeric DEFAULT 50.00,
  daily_profit numeric DEFAULT 0.00,
  operations_count integer DEFAULT 0,
  consecutive_losses integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de operações
CREATE TABLE IF NOT EXISTS operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  value numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('win', 'loss')),
  result numeric NOT NULL,
  balance numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE daily_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público (você pode restringir depois se necessário)
CREATE POLICY "Permitir todas as operações em daily_config"
  ON daily_config
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir todas as operações em operations"
  ON operations
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_daily_config_date ON daily_config(date);
CREATE INDEX IF NOT EXISTS idx_operations_date ON operations(date);
CREATE INDEX IF NOT EXISTS idx_operations_created_at ON operations(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela daily_config
CREATE TRIGGER update_daily_config_updated_at
    BEFORE UPDATE ON daily_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();