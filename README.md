# 📊 Controle de Investimentos

Sistema completo para controle e monitoramento de operações de investimento com meta diária, limites de operações e integração com Supabase.

## 🚀 Funcionalidades

- ✅ **Controle de Saldo**: Acompanhe seu saldo atual em tempo real
- ✅ **Meta Diária**: Sistema configurado para meta de $10 USD por dia
- ✅ **Limite de Operações**: Máximo de 3 operações por dia
- ✅ **Controle de Perdas**: Para automaticamente após 2 perdas consecutivas
- ✅ **Histórico Completo**: Todas as operações são salvas permanentemente
- ✅ **Persistência de Dados**: Integração completa com Supabase
- ✅ **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Banco de Dados**: Supabase (PostgreSQL)
- **Hospedagem**: Compatível com Vercel, Netlify, Heroku

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- Conta no Supabase
- Git

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/controle-investimentos.git
cd controle-investimentos
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### 3.1. Configure as tabelas do banco
1. No painel do Supabase, vá em "SQL Editor"
2. Execute os scripts SQL na seguinte ordem:
   - Primeiro: `supabase/migrations/20250723142823_winter_ocean.sql`
   - Segundo: `supabase/migrations/20250723160541_turquoise_wildflower.sql`

**Importante**: Execute ambos os scripts para garantir que o banco de dados tenha a estrutura correta e aceite todos os tipos de operação (win-90, win-96, win-85, win-87, loss).


### 4. Execute o projeto
```bash
npm start
```

O sistema estará disponível em `http://localhost:3000`

## 📱 Como Usar

### Registrar uma Operação
1. Digite o valor da operação em USD
2. Selecione o resultado (Vitória ou Perda)
3. Clique em "Registrar Operação"

### Regras do Sistema
- **Vitórias**: Retornam 90% de lucro sobre o valor apostado
- **Perdas**: Perdem 100% do valor apostado
- **Limite Diário**: Máximo 3 operações por dia
- **Proteção**: Sistema para após 2 perdas consecutivas
- **Meta**: $10 USD de lucro por dia

### Controles Disponíveis
- **Resetar Dia**: Remove todas as operações do dia atual
- **Novo Dia**: Inicia um novo dia mantendo o saldo atual

## 🗂️ Estrutura do Projeto

```
controle-investimentos/
├── public/
│   ├── index.html          # Interface principal
│   ├── style.css           # Estilos da aplicação
│   ├── script.js           # Lógica principal
│   └── supabase.js         # Configuração do Supabase
├── supabase/
│   └── migrations/         # Scripts de migração do banco
├── server.js               # Servidor Express
├── package.json            # Dependências do projeto
├── .env                    # Variáveis de ambiente (não commitado)
└── README.md               # Documentação
```

## 🚀 Deploy

### Vercel
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático a cada push

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático

### Heroku
1. Crie um app no Heroku
2. Configure as variáveis de ambiente
3. Conecte ao GitHub para deploy automático

## 🔒 Segurança

- Todas as chaves sensíveis estão em variáveis de ambiente
- Row Level Security (RLS) habilitado no Supabase
- Validações tanto no frontend quanto no backend

## 📊 Banco de Dados

### Tabela: daily_config
Armazena a configuração e status de cada dia:
- `date`: Data do dia
- `initial_balance`: Saldo inicial do dia
- `current_balance`: Saldo atual
- `daily_profit`: Lucro/prejuízo do dia
- `operations_count`: Número de operações realizadas
- `consecutive_losses`: Perdas consecutivas

### Tabela: operations
Armazena todas as operações realizadas:
- `date`: Data da operação
- `value`: Valor apostado
- `type`: Tipo (win/loss)
- `result`: Resultado da operação
- `balance`: Saldo após a operação

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme se as tabelas do Supabase foram criadas corretamente
3. Abra uma issue no GitHub com detalhes do problema

## 🎯 Roadmap

- [ ] Gráficos de performance
- [ ] Relatórios mensais
- [ ] Múltiplas estratégias
- [ ] Notificações push
- [ ] API REST completa
- [ ] Aplicativo mobile

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!