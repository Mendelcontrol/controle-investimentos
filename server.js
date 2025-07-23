const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Exemplo de rota para salvar operação
app.post('/api/operacao', async (req, res) => {
  const { valor, resultado } = req.body;

  const { data, error } = await supabase
    .from('operacoes')
    .insert([{ valor, resultado }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
