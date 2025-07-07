-- Limpar os vídeos de exemplo existentes
DELETE FROM public.system_videos;

-- Inserir os vídeos reais fornecidos pelo usuário
INSERT INTO public.system_videos (title, youtube_url, description, order_position) VALUES
('Introdução ao FluxoAzul - Como começar', 'https://www.youtube.com/watch?v=IypC_sl94uE', 'Aprenda os primeiros passos para usar o sistema FluxoAzul', 1),
('Gestão Financeira - Lançamentos', 'https://www.youtube.com/watch?v=qj93DPQ52GI', 'Tutorial completo sobre como fazer lançamentos financeiros', 2),
('Controle de Estoque', 'https://www.youtube.com/watch?v=oUSnPO1nnl8', 'Como gerenciar seu estoque de forma eficiente', 3),
('Relatórios DRE', 'https://www.youtube.com/watch?v=AFg2-cKcoZQ', 'Entenda como gerar e interpretar relatórios DRE', 4),
('Fluxo de Caixa', 'https://www.youtube.com/watch?v=CsynUUZXP9c', 'Tutorial sobre controle de fluxo de caixa', 5),
('Cadastros de Clientes', 'https://www.youtube.com/watch?v=Gc3QsEoaBjs', 'Como cadastrar e gerenciar clientes e fornecedores', 6),
('Precificação de Produtos', 'https://www.youtube.com/watch?v=vy4LLwlh0Q0', 'Aprenda a calcular preços de produtos e serviços', 7);