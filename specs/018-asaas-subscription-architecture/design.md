# Design: Arquitetura de Planos e Assinaturas (Spec 018)

## Database Modeling (Supabase)

### Tabela: `plans`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | PK |
| `name` | Text | Ex: "Plano Premium Anual" |
| `base_price` | Numeric | Preço Base |
| `extra_user_price` | Numeric | Preço da Tela Extra |
| `billing_cycle` | Text | `MONTHLY`, `QUARTERLY`, `SEMIANNUALLY`, `YEARLY` (Define os vencimentos) |
| `is_active` | Boolean | Disponibilidade do plano |

### Tabela: `subscriptions`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | PK |
| `user_id` | UUID | FK -> auth.users (O Cliente) |
| `plan_id` | UUID | FK -> plans |
| `asaas_customer_id`| Text | ID do cliente no Asaas (cus_123) |
| `asaas_subscription_id`| Text | ID da assinatura no Asaas (sub_123) |
| `extra_users_count` | Int | Quantidade de telas adicionais contratadas |
| `total_price` | Numeric | Valor total gerado pra cobrança |
| `status` | Text | `ACTIVE`, `OVERDUE`, `CANCELED`, `PENDING` |
| `next_due_date` | Date | Próximo vencimento previsto |

### Tabela: `invoices` (Histórico de Pagamentos)
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | PK |
| `subscription_id` | UUID | FK -> subscriptions |
| `asaas_payment_id` | Text | ID da cobrança no Asaas (pay_123) |
| `amount` | Numeric | Valor da fatura |
| `due_date` | Date | Data de Vencimento |
| `status` | Text | `PENDING`, `RECEIVED`, `OVERDUE` |

## UI Architecture (Stitch / Lovable)
1. **Admin > Planos (`/admin/planos`):** CRUD local. O administrador cria os planos e define os `billing_cycle` (mensal/anual).
2. **Admin > Clientes (`/admin/clientes`):** Uma tabela robusta listando clientes (focada em Data Table Shadcn). 
3. **Admin > Perfil do Cliente (`/admin/clientes/$id`):** 
   - **Cabeçalho:** Informações pessoais e Status da Assinatura (Badge verde/vermelho).
   - **Card Esquerdo:** Detalhes do Plano Atual e quantidade de telas extras. Botão de "Editar Telas" (que fará Update no Asaas) e "Cancelar Assinatura".
   - **Card Direito:** Histórico de Pagamentos (Invoices) extraído da base local.
