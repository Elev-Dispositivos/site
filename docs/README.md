# Documentação Técnica: Supabase e Segurança (ELEV Dispositivos)

Este diretório contém os scripts de configuração, segurança e automação do banco de dados/API do site.

## 📝 Scripts SQL (Executar no SQL Editor do Supabase)

### 1. Newsletter (`supabase-newsletter.sql`)
- **Tabela**: `newsletter`.
- **Segurança**: RLS habilitado (bloqueio total).
- **Função**: `subscribe_newsletter(p_email TEXT)` - Utilizada pelo front-end para inscrições seguras.
- **RPC**: Permissão de execução para usuários `anon`.

### 2. Analytics / Contador de Visitas (`supabase-analytics.sql`)
- **Tabela**: `site_visitas`.
- **Rastreamento**: Único por sessão do navegador (via `sessionStorage`).
- **Função**: `log_visit(p_session_id TEXT, p_url TEXT, p_user_agent TEXT)`.
- **View**: `view_estatisticas_visitas` para visualização rápida no dashboard.

### 3. Permissões de Views (`supabase-permissoes-views.sql`)
- **Público (`anon`)**: `dispositivos_publicos`, `posts_blog`, `posts_redes`.
- **Privado (`authenticated`)**: `vendas_mensais`, `orcamentos_com_dispositivos`.
- **Correção**: Inclui comandos `REVOKE` para limpar permissões antigas.

### 4. Hierarquia de Usuários - RBAC (`supabase-rbac-usuarios.sql`)
- **Tabela**: `usuarios`.
- **Coluna**: `roles` (Tipo ENUM `user_role`).
- **Enum Roles**: `ADM`, `Lideres`, `Colaboradores`, `Clientes`.
- **Políticas (RLS)**:
  - Usuários podem ver apenas os seus próprios dados.
  - **ADMs** e **Líderes** têm visibilidade total de toda a tabela.

### 5. RLS Geral de Tabelas (`supabase-rls-tabelas.sql`)
- Ativação de RLS e políticas de acesso total para usuários logados nas tabelas:
  - `notificacoes`
  - `orcamento_dispositivos`
  - `orcamentos`
  - `posts_blog`
  - `posts_redes_sociais`

### 6. Candidatos (`supabase-candidatos.sql`)
- **Tabela**: `candidatos`.
- **Segurança**: RLS para restringir visualização apenas a ADM, Líderes e Colaboradores.
- **Público**: Função `submeter_candidatura` para submissão anônima segura.

### 7. Anúncios (`supabase-anuncios-e-kb.sql`)
- **Tabela**: `anuncios`.
- **Segurança**: RLS privado apenas para ADM, Líderes e Colaboradores.

### 8. Base de Conhecimento (`supabase-anuncios-e-kb.sql`)
- **Tabela**: `base_conhecimento`.
- **Leitura**: Pública.
- **Edição**: Privada apenas para equipe interna (não clientes).

---

## 🔒 Segurança do Front-end
- **.env**: Local das credenciais sensíveis (não commitado).
- **supabase-config.js**: Centraliza a conexão e é injetado dinamicamente para maior segurança.
- **scripts.js**: Contém o rastreador de sessões automáticas.
