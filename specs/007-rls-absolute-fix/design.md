# Spec 007: RLS Absolute Fix & Asaas Engine - Design

## A Intervenção SQL no Supabase
O Database Engineer aplicará o seguinte SQL estrito via push forçado:
```sql
-- Habilitar leitura pública para renderizar os cards nas telas de Cliente e Admin
CREATE POLICY "Leitura Pública Planos" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Leitura Pública Devices" ON onboarding_devices FOR SELECT USING (true);
CREATE POLICY "Leitura Pública Servidores" ON xtream_servers FOR SELECT USING (true);

-- Garante que admin@kicktv.com possa inserir, atualizar e deletar
-- (Assumindo que o Admin tem o email listado)
CREATE POLICY "Escrita Admin Planos" ON subscription_plans FOR ALL USING (auth.jwt() ->> 'email' = 'admin@kicktv.com');
```
*Isto substituirá as policies complexas que estão falhando.*

## UX Pagamentos
A aba de Configurações no Admin vai permitir inserir o **Asaas Access Token**.
O Edge Function lerá este Token via `process.env` ou da tabela `integrations` do banco de dados antes de fazer o fetch para `api.asaas.com`.
