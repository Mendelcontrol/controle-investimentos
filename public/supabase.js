// Configuração do cliente Supabase
const supabaseUrl = 'https://wfwuquwwtwczznmqyvbu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmd3VxdXd3dHdjenpubXF5dmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzgwNDYsImV4cCI6MjA2ODg1NDA0Nn0.4m-eZGW2z6i-aBPxrW5BKyeA82SQEvrNM1fDFuP3MCA';

// Inicializar cliente Supabase
window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Verificar conexão
window.supabase.from('daily_config').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Erro na conexão com Supabase:', error);
    } else {
      console.log('✅ Conectado com sucesso ao Supabase!');
    }
  });