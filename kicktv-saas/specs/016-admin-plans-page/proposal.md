# Proposta de Arquitetura (016-admin-plans-page)

## Requisitos de Negócio
1. O Administrador deve poder visualizar, criar, editar e desativar "Planos" de assinatura.
2. Cada Plano deve possuir Nome, Preço, Duração (meses), e Limite de Telas/Conexões Simultâneas.
3. A tela deve seguir a identidade visual "Apple Liquid Glass" / Maximalismo Tátil definida no projeto.
4. (Bug Fix) O erro de build no Tailwind `tailwindcss-animate` deve ser solucionado.

## BDD Scenarios

### Cenário: Listagem de Planos
- **Dado** que o Administrador acessa `/admin/planos`
- **Quando** a página carrega
- **Então** ele deve ver a lista de planos cadastrados no banco de dados Supabase via SSR, com Fallback seguro caso a tabela esteja vazia ou offline.

### Cenário: Erro de Build Turbopack
- **Dado** que o desenvolvedor inicia o servidor Next.js
- **Quando** o arquivo `globals.css` é processado pelo Tailwind v4
- **Então** ele não deve emitir `CssSyntaxError` por causa da resolução de módulo do plugin animate.
