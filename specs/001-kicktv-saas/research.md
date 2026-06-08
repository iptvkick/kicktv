# Fase Research (RPI-R) — KickTV SaaS

## 1. Contexto e Escopo
O projeto consiste em um SaaS de onboarding, gestão financeira e painel de clientes para IPTV, nomeado **KickTV**.
O objetivo é substituir processos manuais de revenda por um sistema automatizado com um visual estético premium (2026), que integra Asaas, e painéis Xtream via Supabase Edge Functions.

## 2. Análise do Cliente (KickTV)
- **URL Base:** `https://kicktv-onboard-glow-91.lovable.app/`
- **Branding Extraído:** Foco em qualidade "Premium", promessas de melhor qualidade e preço do mercado. Vibe focada em entretenimento de alta conversão.
- **Dores Resolvidas:** Otimização do funil de vendas, entrega automática de testes (trials) de 4 horas, redução de churn via autoatendimento, facilidade no pagamento de faturas (PIX).

## 3. Benchmarking de Concorrentes

### Concorrente A: WHMCS com Módulo Smarters
- **Pontos Fortes:** Muito robusto, maduro, automatiza a criação de faturas e provisionamento de contas no servidor Xtream.
- **Pontos Fracos:** Visual muito datado (estética 2010s), complexo de configurar, requer hospedagem própria ou servidores parrudos, não tem foco na conversão "agressiva" ou em UX mobile-first moderna.

### Concorrente B: Painéis Integrados de Fornecedores (Ex: Xtreme HD)
- **Pontos Fortes:** Zero configuração, painel já vem com a compra dos créditos.
- **Pontos Fracos:** O cliente final não tem um "Portal do Assinante" bonito; a revenda tem que fazer todo o processo manual de cobrança via WhatsApp e criar o teste na mão.

### Concorrente C: Auto IPTV Panel
- **Pontos Fortes:** Foco em automação de revenda de IPTV.
- **Pontos Fracos:** Falta a estética "Liquid Glass" e o design focado no usuário final (B2C).

## 4. Conclusões da Pesquisa
O KickTV se destacará pelo **Design de 2026**, removendo todo o atrito do cliente final. A arquitetura descentralizada usando Supabase como intermediário garante segurança (impedindo que o painel Master seja exposto) e permite a escalabilidade. O uso de **Self-Healing DNS** é uma inovação gigante no mercado de IPTV para reduzir suporte técnico.
