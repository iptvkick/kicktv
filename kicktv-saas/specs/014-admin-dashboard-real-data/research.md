# Pesquisa e Contexto: Dashboard Admin com Dados Reais

## Arquivos e Escopo
A rota `/admin/dashboard` atualmente possui apenas uma base de layout estática ou hardcoded. Conforme a imagem de referência, precisamos implementar:
1. **Visão Geral:** Cards com "Usuários Ativos", "Receita Mensal", "Trials Ativos" e "Taxa de Conversão".
2. **Últimos Registros:** Tabela com usuários recentes, planos, status e tempo de registro.
3. **Status dos Servidores:** Lista de servidores conectados (Xtream) com status (ping/usuários).
4. **Navegação Lateral:** Visão Geral (Pronto), Planos, Servidores, Tutoriais (Pendentes).

## Dependências de Dados (Supabase)
Ao inspecionar o `20260608154610_initial_schema.sql`, identificamos as seguintes tabelas:
- `profiles`: Possui usuários (`role = cliente`).
- `iptv_subscriptions`: Possui status (`trial`, `ativo`), vencimentos e o `url_servidor`.
- `payments`: Possui receitas, status (`pago`) e métodos.

**Lacunas Encontradas:**
1. A tabela `servers` ou `planos` não existe de forma explícita no banco atual, sendo o `url_servidor` armazenado diretamente no `iptv_subscriptions`. Precisamos decidir se criamos tabelas específicas ou consumimos dados de configurações soltas no DB.
2. Como o usuário pediu dados reais, precisamos orquestrar Server Components que executem `supabase.from()` agrupando as métricas de receita (sum valor), contagem de trials e clientes ativos.

## Análise Visual (Benchmarking KickTV UI)
- Padrões visuais "Apple Liquid Glass" misturados com UI de alta conversão (Maximalismo Tátil).
- Sombra difusa suave, microinterações.
- Paleta: Branco gelo (`#f5f6f7`), cartões brancos sólidos (`#ffffff`) e destaques em verde néon/lima.
