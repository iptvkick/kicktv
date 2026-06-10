# Design (Stitch / Supabase)

## Arquitetura UI (Stitch MCP & Frontend)
**Estilo Base:** Seguimos as diretrizes de "Banking App" do projeto atual (Sólido, alto contraste, cantos arredondados, sem elementos excessivos de Liquid Glass, visto que foi removido anteriormente em prol de uma UI mais limpa).

### 1. `src/routes/admin/onboarding.tsx`
A tela já possui um grid 1/3 (Lista) vs 2/3 (Passos). Modificações de design e estado:
- Quando o admin clicar em um Aparelho da lista à esquerda, esse Aparelho se torna o estado `selectedDevice`.
- O lado direito renderiza os passos atrelados a `selectedDevice.id`.
- O botão "Adicionar Passo" fará um INSERT na base, e exibirá o Card em modo de leitura com um botão (Editar/Apagar).
- Não usaremos o estado mockado, e cada edição persistirá no Supabase.

### 2. `src/routes/admin/configuracoes.tsx`
O Card "Asaas (Pagamentos)" será redesenhado com um formulário de abas lógicas (ou Toggle):
- **Segmented Control:** `Sandbox` | `Produção`
- Se `Sandbox` estiver selecionado, exibe o input `sandbox_key`.
- Se `Produção` estiver selecionado, exibe o input `production_key`.
- Apenas um é o Ambiente Ativo, controlado por um Toggle Switch (ex: Shadcn Switch) no topo "Forçar Ambiente Sandbox".
- Um botão "Testar Conexão Asaas" que invoca a Edge Function e dispara um Toast/Alert do resultado.

### 3. `src/routes/cliente/dashboard.tsx`
Abandonaremos o scroll contínuo e adotaremos Componentes de Aba usando Radix/Shadcn ou Pills de Navegação customizados.
```jsx
// Exemplo estrutural de Design:
<div className="flex gap-2 mb-6 overflow-x-auto pb-2">
  <button className={activeTab === 'pessoal' ? 'bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-bold' : 'bg-card text-foreground px-4 py-2 rounded-full border border-border text-sm font-bold'}>
    Dados Pessoais
  </button>
  // ... Métodos de Pagamento, Segurança
</div>
```
Cada aba exibirá condicionalmente (via condicional de renderização `activeTab === 'pessoal' && ...`) os sub-blocos do Dashboard, limpando imensamente a interface do Cliente. O card vermelho de Expirado só será exibido caso de fato os 4 horas tenham vencido.

## Arquitetura de Banco de Dados (Supabase MCP)

### Tabela `integrations`
Vamos migrar do modelo simplista para um payload em JSONB que acomoda tudo:
```sql
ALTER TABLE public.integrations ADD COLUMN credentials JSONB DEFAULT '{}'::jsonb;
-- Exemplo de uso no JSONB:
-- { "sandbox_key": "abc", "production_key": "xyz", "environment": "sandbox" }
```
A coluna `api_key` antiga pode ser deprecada.

### Tabela `onboarding_steps`
Garantir que a tabela possui:
- `id` (uuid)
- `device_id` (uuid, fk para `onboarding_devices`)
- `title` (text)
- `description` (text)
- `youtube_id` (text, nullable)
- `order_index` (int)

### Lógica do Trial (PostgreSQL Trigger)
No Supabase, criaremos um Trigger na tabela `profiles`. 
Quando um usuário for Inserido (Após a trigger existente `on_auth_user_created`), inseriremos ou atualizaremos a tabela `subscriptions` para o novo profile, definindo:
```sql
INSERT INTO public.subscriptions (profile_id, status, expires_at)
VALUES (NEW.id, 'trialing', NOW() + INTERVAL '4 hours');
```
Assim, garantimos integridade a nível de banco de dados sem depender do frontend chamar uma API lenta na hora do registro.
