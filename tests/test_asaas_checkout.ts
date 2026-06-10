import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Carrega variáveis do .env localmente para não depender de flags do Node
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[key] = process.env[key] || val;
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("ERRO: SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY não encontrados no .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateCPF(): string {
  const randomDigit = () => Math.floor(Math.random() * 10);
  const n = Array.from({ length: 9 }, randomDigit);

  const calcDigit = (digits: number[], factor: number) => {
    const total = digits.reduce((sum, d, i) => sum + d * (factor - i), 0);
    const mod = total % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const d1 = calcDigit(n, 10);
  const d2 = calcDigit([...n, d1], 11);

  return `${n.join('')}${d1}${d2}`;
}

async function run() {
  console.log("Iniciando teste Asaas Checkout...");

  // 1. Precisamos de um usuário logado para chamar a Edge Function
  const testEmail = `test.asaas.${Date.now()}@example.com`;
  const testPassword = "TestPassword123!";
  
  console.log(`Registrando usuário temporário: ${testEmail}`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (authError) {
    console.error("Erro ao registrar usuário:", authError.message);
    return;
  }

  // Verificar se o usuário foi logado direto ou precisa de confirmação (em dev costuma logar direto)
  if (!authData.session) {
    console.warn("AVISO: signUp não retornou sessão. Pode estar exigindo confirmação de email.");
    console.warn("Tentando logar com o usuário criado...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (signInError || !signInData.session) {
      console.error("Erro ao logar com o usuário temporário:", signInError?.message || "Sem sessão");
      return;
    }
  }

  console.log("Usuário autenticado com sucesso.");

  // 2. Buscar um planId válido
  console.log("Buscando um plano válido...");
  const { data: plans, error: plansError } = await supabase
    .from('plans')
    .select('id')
    .limit(1);

  if (plansError) {
    console.error("Erro ao buscar planos:", plansError.message);
    return;
  }

  if (!plans || plans.length === 0) {
    console.error("Nenhum plano encontrado no banco de dados.");
    return;
  }

  const planId = plans[0].id;
  console.log(`Plano encontrado: ${planId}`);

  // 3. Gerar mock CPF
  const mockCpf = generateCPF();
  console.log(`CPF mockado gerado: ${mockCpf}`);

  // 4. Chamar Edge Function asaas-checkout
  console.log("Chamando Edge Function asaas-checkout...");
  const { data: response, error: fnError } = await supabase.functions.invoke('asaas-checkout', {
    body: {
      planId,
      cpfCnpj: mockCpf,
      serverId: 'default'
    }
  });

  if (fnError) {
    console.error("Erro ao chamar Edge Function:", fnError.message);
    return;
  }

  console.log("=== Resposta da Edge Function ===");
  console.log(JSON.stringify(response, null, 2));

  // Opcional: Se response contiver um código PIX, mostrar um alerta de sucesso
  if (response?.pix?.encodedImage) {
    console.log("✅ SUCESSO! QR Code PIX (Base64) gerado com sucesso.");
  } else if (response?.error) {
    console.log("❌ A function retornou status 200 mas com erro no payload:", response.error);
  }
}

run();
