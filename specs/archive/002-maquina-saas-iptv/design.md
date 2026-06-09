# Fase 1: A Máquina de SaaS IPTV - Design & Arquitetura

## 1. UI / UX Design (Stitch / Frontend)
Conforme a política do `ux-ui-architect-2026`, o sistema fugirá do minimalismo estéril.
- **Estilo Padrão:** "Dark Technical". Fundo `#0a0a0f`, com `backdrop-blur-xl` e bordas vítreas (`border-white/10`). Detalhes em accent Indigo e Cyan para um tom tecnológico, confiável e futurista.
- **Tipografia:** `Outfit` para Headlines agressivos (foco em conversão máxima) e `Inter` para o corpo e instruções.
- **Acessibilidade de Foco:** O onboarding deve ser ultra claro. A atenção do usuário só deve ir para o passo atual. Os cards de tutorial terão `:focus-visible` de alto contraste e micro-interações (`transform: translateY(-4px)`).
- **Provas Sociais & Urgência:** Aplicadas organicamente na Home e na tela de Upgrade de plano.

## 2. Modelagem do Banco de Dados (Supabase PostgreSQL)
A estrutura garantirá que a aplicação seja puramente um "renderizador" burro. Toda a inteligência reside nas tabelas:

```sql
-- Resumo de Tabelas Essenciais
CREATE TABLE public.onboarding_devices (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL, -- Ex: "Roku TV", "Firestick"
    icon_name TEXT, -- Ex: "Tv", "Monitor" (Lucide icon names)
    order_index INT,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE public.onboarding_steps (
    id UUID PRIMARY KEY,
    device_id UUID REFERENCES onboarding_devices(id),
    step_number INT,
    title TEXT NOT NULL,
    description TEXT NOT NULL, -- Pode conter markdown ou código
    media_url TEXT, -- Imagem opcional do passo
    shortcode TEXT -- Específico para campos customizados
);

CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY,
    name TEXT,
    price DECIMAL(10,2),
    duration_days INT,
    xtream_package_id INT, -- ID mapeado no painel Master
    benefits JSONB,
    is_highlighted BOOLEAN DEFAULT false
);

CREATE TABLE public.support_solutions (
    id UUID PRIMARY KEY,
    issue_type TEXT, -- "travamento", "tela_preta"
    device_type TEXT,
    resolution_text TEXT
);
```

Todas as tabelas terão RLS rigoroso: Leitura pública ou autenticada, mas Escrita restrita a administradores.

## 3. Integração de API (Supabase Edge Functions)
- **`create-trial`:** Recebe a solicitação autenticada do usuário. Confere se já não existe teste prévio via histórico de IP ou conta. Chama a API `manage_users.php` do Xtream usando fetch nativo do Deno. Retorna credenciais.
- **`webhook-payments`:** Endpoint desprotegido de auth normal (usa header signature de validação Asaas/MercadoPago). Atualiza `profiles` e estende assinatura na API Xtream.
