-- Seed file for KickTV SaaS

-- 1. Insert default Servers
INSERT INTO public.servers (id, name, m3u_url, dns_url, is_active)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Servidor P2P Nexus', 'http://nexus-stream.net/get.php', 'nexus-stream.net', true),
  ('22222222-2222-2222-2222-222222222222', 'Servidor IPTV Plus (Alternativo)', 'http://iptvplus-br.com/get.php', 'iptvplus-br.com', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert default Plans
INSERT INTO public.plans (id, name, price_monthly, features, is_active)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'Essencial', 35.00, '["Acesso completo a canais, filmes e séries", "1 Tela inclusa", "Tecnologia híbrida Anti-Travamento", "Suporte 24/7"]', true),
  ('44444444-4444-4444-4444-444444444444', 'Premium 4K', 45.00, '["Tudo do Essencial", "Catálogo Nexus On-Demand", "Interface Ultra Fluida", "Conteúdo +18 Opcional"]', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert default Devices
INSERT INTO public.devices (id, name, description, instructions, video_url, icon)
VALUES 
  ('smart-tv', 'Smart TV', 'TV Inteligente (Samsung, LG, Roku)', '1. Acesse a loja de aplicativos da sua TV.\n2. Busque por "Smart IPTV" ou "IBO Player" e instale.\n3. Abra o app e anote o Mac Address.\n4. Volte aqui e insira seus dados para vincular a lista M3U.', 'https://www.youtube.com/embed/dummy_video_tv', 'Tv'),
  ('android', 'Android', 'Celular ou Tablet', '1. Acesse a Google Play Store.\n2. Busque por "IPTV Smarters Pro" e baixe.\n3. Faça login com o usuário e senha fornecidos após assinar.', 'https://www.youtube.com/embed/dummy_video_android', 'Smartphone'),
  ('iphone', 'iPhone / iPad', 'Dispositivos iOS', '1. Abra a App Store.\n2. Busque por "Smarters Player Lite" e instale.\n3. Faça login com o Usuário e Senha.', 'https://www.youtube.com/embed/dummy_video_ios', 'Smartphone'),
  ('pc', 'Computador', 'Windows ou Mac', '1. Faça o download do nosso WebPlayer no site oficial.\n2. Instale e coloque seu usuário e senha.', 'https://www.youtube.com/embed/dummy_video_pc', 'Monitor'),
  ('tv-box', 'TV Box', 'Aparelhos Android TV', '1. Abra a Play Store do seu TV Box.\n2. Instale o "XCIPTV Player".\n3. Preencha com os dados DNS, Usuário e Senha.', 'https://www.youtube.com/embed/dummy_video_box', 'Cast')
ON CONFLICT (id) DO NOTHING;
