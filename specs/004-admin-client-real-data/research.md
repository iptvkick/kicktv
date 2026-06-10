# Spec 004: Real Data & Clean UI - Research (RPI-R)

## Estado Atual do Sistema
1. **Painel Admin & Cliente (Mockados):** As telas construídas nas Specs anteriores (001, 002) utilizaram dados simulados para acelerar a validação visual. Tabelas como `subscription_plans`, `onboarding_devices` já existem no Supabase, mas a UI não está conectada a elas via `supabase-js`.
2. **Integração Asaas (Ausente):** Não existe interface no Admin para o dono do SaaS configurar o `ASAAS_API_KEY`. Precisamos de uma tabela `admin_settings` ou `integrations` no Supabase para armazenar isso de forma segura.
3. **Inconsistência Visual (Cliente):** O painel do cliente possui resquícios de designs antigos. O "verde vibrante" introduzido na Spec 003 não agradou, o usuário prefere um visual 100% neutro/monocromático.

## Achados de Arquitetura
Para plugar os dados reais no React sem travar a UI, precisaremos utilizar a instância do Supabase instanciada no lado do cliente (`src/integrations/supabase/client.ts`) combinada com React Hooks para buscar (fetch) e mutar (insert/update/delete) as informações das tabelas já existentes.
