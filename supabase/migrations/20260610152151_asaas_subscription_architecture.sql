-- Limpando tabelas antigas se existirem
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;

-- Criando tabela plans
CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    base_price NUMERIC NOT NULL,
    extra_user_price NUMERIC NOT NULL,
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'YEARLY')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criando tabela subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES plans(id) ON DELETE RESTRICT NOT NULL,
    asaas_customer_id TEXT,
    asaas_subscription_id TEXT,
    extra_users_count INT NOT NULL DEFAULT 0,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'OVERDUE', 'CANCELED', 'PENDING')),
    next_due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criando tabela invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
    asaas_payment_id TEXT,
    amount NUMERIC NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'RECEIVED', 'OVERDUE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criando Índices (Regra 5)
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Habilitando RLS (Regra 1)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Políticas para plans
-- Apenas Admins podem fazer CRUD (Regra 2 da task)
CREATE POLICY "Admins can manage plans"
ON plans
FOR ALL
USING (is_super_admin());

-- Mas permitimos SELECT para todos os autenticados para que possam assinar
CREATE POLICY "Authenticated users can view active plans"
ON plans
FOR SELECT
TO authenticated
USING (is_active = true);

-- Políticas para subscriptions
CREATE POLICY "Admins can manage subscriptions"
ON subscriptions
FOR ALL
USING (is_super_admin());

CREATE POLICY "Users can view their own subscriptions"
ON subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Políticas para invoices
CREATE POLICY "Admins can manage invoices"
ON invoices
FOR ALL
USING (is_super_admin());

CREATE POLICY "Users can view their own invoices"
ON invoices
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM subscriptions
    WHERE subscriptions.id = invoices.subscription_id
    AND subscriptions.user_id = auth.uid()
  )
);
