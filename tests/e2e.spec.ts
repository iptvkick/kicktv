import { test, expect } from '@playwright/test';

// Gera dados dinâmicos para evitar conflitos no banco
const timestamp = Date.now();
const qaEmail = `qa-user-${timestamp}@test.com`;
const qaPassword = `QApass123!`;
const qaName = `QA Tester ${timestamp}`;
const planoNome = `Plano QA ${timestamp}`;
const servidorNome = `Servidor QA ${timestamp}`;

test.describe('E2E KickTV Flows', () => {

  test('Fluxo de Proteção: Acesso direto ao Admin redireciona para Login', async ({ page }) => {
    // Tenta acessar /admin/planos direto sem sessão
    await page.goto('/admin/planos');
    
    // Deve ser redirecionado para a rota de login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('Fluxo de Onboarding, Registro e CRUDs no Painel', async ({ page }) => {
    test.slow();
    // Habilita a aceitação automática de diálogos de confirmação (para exclusão de itens)
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    // 1. Navega para a Landing Page
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'KickTV' }).first()).toBeVisible();

    // 2. Clica no botão de Teste Grátis
    const startButton = page.locator('text=Teste Grátis por 4 Horas');
    await startButton.click();

    // Deve estar na rota de registro
    await expect(page).toHaveURL(/\/auth\/register/);

    // Aguarda a hidratação completa do React/TanStack Start
    await page.waitForTimeout(2000);

    // 3. Preenche o formulário de cadastro
    await page.locator('input[placeholder="João da Silva"]').fill(qaName);
    await page.locator('input[placeholder="joao@exemplo.com"]').fill(qaEmail);
    await page.locator('input[placeholder="••••••••"]').fill(qaPassword);
    
    // Envia o formulário
    await page.locator('button:has-text("Liberar meu Acesso")').click();

    // 4. Deve ser redirecionado para o onboarding tutorial
    await expect(page).toHaveURL(/\/onboarding\/tutorial/);

    // 5. Executa os passos do tutorial
    // Passo 1 -> Passo 2
    await page.locator('button:has-text("Próximo Passo")').click();
    
    // Passo 2 -> Passo 3
    await page.locator('button:has-text("Próximo Passo")').click();

    // Passo 3 -> Gerar Teste
    const generateButton = page.locator('button:has-text("Instalei, Gerar Teste")');
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    // Deve abrir o modal de sucesso com as credenciais (estendendo timeout devido ao delay de rede/simulação)
    await expect(page.locator('text=Teste Liberado!')).toBeVisible({ timeout: 10000 });

    // Clica em "Ir para meu Painel"
    await page.locator('button:has-text("Ir para meu Painel")').click();

    // Deve ir para o dashboard do cliente
    await expect(page).toHaveURL(/\/cliente\/dashboard/);

    // 6. CRUD de Planos de Assinatura (/admin/planos)
    // Agora que o usuário está logado e tem uma sessão ativa, acessamos /admin/planos
    await page.goto('/admin/planos');
    await expect(page).toHaveURL(/\/admin\/planos/);

    // Clica em "Novo Plano"
    await page.locator('button:has-text("Novo Plano")').click();

    // Preenche os dados do plano
    await page.locator('input[placeholder="Ex: Mensal Básico"]').fill(planoNome);
    await page.locator('div:has(label:has-text("Duração (Meses)")) input').fill('3');
    await page.locator('div:has(label:has-text("Preço Base (R$)")) input').fill('99');
    await page.locator('div:has(label:has-text("Preço Tela Extra (R$)")) input').fill('15');

    // Salva o plano
    await page.locator('button:has-text("Salvar Plano")').click();

    // Valida que o plano foi adicionado e está visível
    await expect(page.locator(`.bg-card:has-text("${planoNome}")`)).toBeVisible();

    // 7. CRUD de Servidores Xtream (/admin/servidores)
    await page.goto('/admin/servidores');
    await expect(page).toHaveURL(/\/admin\/servidores/);

    // Clica em "Adicionar Servidor"
    await page.locator('button:has-text("Adicionar Servidor")').click();

    // Preenche dados do servidor
    await page.locator('input[placeholder="Servidor Principal"]').fill(servidorNome);
    await page.locator('input[placeholder="http://..."]').fill('http://xtream-test.live:8080');
    await page.locator('div:has(label:has-text("Usuário")) input').fill('qa_user');
    await page.locator('div:has(label:has-text("Senha")) input').fill('qa_pass');

    // Salva o servidor
    await page.locator('button:has-text("Salvar Servidor")').click();

    // Valida que o servidor foi listado na tabela
    await expect(page.locator(`tr:has-text("${servidorNome}")`)).toBeVisible();

    // 8. Exclui o servidor criado para deixar o banco limpo
    const serverRow = page.locator(`tr:has-text("${servidorNome}")`);
    await serverRow.locator('button').last().click();

    // Valida que o servidor sumiu
    await expect(page.locator(`tr:has-text("${servidorNome}")`)).not.toBeVisible();

    // 9. Exclui o plano criado para deixar o banco limpo
    await page.goto('/admin/planos');
    await expect(page).toHaveURL(/\/admin\/planos/);

    const planCard = page.locator(`.bg-card:has-text("${planoNome}")`);
    await planCard.locator('button:has-text("Excluir")').click();

    // Valida que o plano sumiu
    await expect(page.locator(`.bg-card:has-text("${planoNome}")`)).not.toBeVisible();
  });

});
