# Spec 004: Real Data & Clean UI - Design

## 1. Ajuste de Paleta (Monocromático Sólido)
O verde do Neobank foi reprovado. Voltaremos à essência absoluta do "Clean".

### Cores Base (CSS)
```css
:root {
  --background: #f5f6f7;
  --foreground: #111827; /* Dark Gray quase preto */
  --card: #ffffff;
  --card-border: #e5e7eb;
  
  /* Accent substituto (Preto/Cinza Escuro em vez de Verde) */
  --accent: #111827;
  --accent-foreground: #ffffff;
}

.dark {
  --background: #0a0a0f;
  --foreground: #f5f6f7;
  --card: #1f2937;
  --card-border: #374151;
  
  --accent: #f5f6f7;
  --accent-foreground: #0a0a0f;
}
```

## 2. Refinamento de Componentes (Painel Cliente)
- Remover todo lixo legado (sombras neon, layouts truncados).
- Utilizar os Cards Pill-shaped já padronizados (`rounded-[24px]`).
- Estrutura clara: Header limpo, Cards de Resumo de Assinatura, Lista de Dispositivos e Faturas.

## 3. Modelagem de Banco (Supabase)
Precisamos adicionar uma tabela para configurações do Admin (ex: Integração Asaas).

**Tabela: `integrations`** (ou `admin_settings`)
- `id` (uuid)
- `provider` (text, ex: 'asaas', 'xtream')
- `api_key` (text, encrypted ou RLS estrito para Admin)
- `is_active` (boolean)
