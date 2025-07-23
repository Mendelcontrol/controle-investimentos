/*
  # Corrigir constraint da tabela operations

  1. Alterações
    - Remover constraint que limitava type apenas a 'win' e 'loss'
    - Permitir valores como 'win-90', 'win-96', etc.

  2. Segurança
    - Manter RLS habilitado
    - Manter políticas existentes
*/

-- Remover constraint existente se existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name LIKE '%operations_type_check%'
  ) THEN
    ALTER TABLE operations DROP CONSTRAINT operations_type_check;
  END IF;
END $$;

-- Adicionar nova constraint que permite win-XX e loss
ALTER TABLE operations 
ADD CONSTRAINT operations_type_check 
CHECK (type ~ '^(win-\d+|loss)$');