# Relatório de Auditoria Técnica: VM Gestão Estratégica

**Auditor:** 🛠️ Augusto Auditor
**Data:** 15 de Março de 2026
**Escopo:** Home, Serviços, Contato
**Status de Prontidão WebMCP:** 🔴 NÃO PREPARADO

---

## 1. Análise de Formulários (Ações Agênticas)

Os formulários atuais dependem de identificação visual (placeholders) e não possuem contratos explícitos para IAs.

### 1.1 Simulador de Revisão da Dívida (Home)
- **Status:** Inacessível para agentes autônomos.
- **Gaps:**
  - Falta de tags `<label>` associadas; usa apenas `placeholder`.
  - Ausência de atributos `tool-name="simular_revisao"`.
  - Não há feedback de erro amigável para máquinas via `aria-errormessage`.
- **Impacto:** Agentes de 2026 falharão ao tentar preencher o simulador por "cegueira semântica".

### 1.2 Formulário de Contato (Home /#contato)
- **Status:** Funcional para humanos, opaco para IAs.
- **Gaps:**
  - Campos identificado por ID (`#nome`, `#email`), mas sem `tool-description`.
  - O botão de envio não possui `tool-action`.
- **Crítico:** A URL `https://vmgestaoestrategica.com.br/contato/` retorna **404**. O menu aponta para uma âncora na Home. Isto confunde exploradores de páginas (crawlers) que buscam páginas de contato independentes.

---

## 2. Estrutura Semântica & GEO (Visibilidade para IA)

### 2.1 Hierarquia de Cabeçalhos
- **Home:** Correta (H1 -> H2 -> H3). O LLM consegue entender a ordem de importância dos serviços.
- **Serviços:** Os botões de filtro (`Gestão Tributária`, etc.) não indicam qual está ativo via `aria-pressed`, o que impede que um agente saiba qual categoria está visualizando após um clique.

### 2.2 Dados Estruturados (Critical Gap)
- **Status:** 🔴 **Ausente**.
- **Observação:** Não foram detectados scripts de JSON-LD ou Schema.org. 
- **Consequência:** Motores de resposta (Answer Engines) como Perplexity e SearchGPT não conseguem "indexar fatos" sobre a VM, prejudicando o ranqueamento GEO.

---

## 3. Checklist de Gaps Técnicos

- [x] Hierarquia H1-H3 (OK)
- [ ] Presença de JSON-LD (FALTOU)
- [ ] Tool Contracts WebMCP (FALTOU)
- [ ] Labels acessíveis para IA (FALTOU)
- [ ] Página de contato dedicada (FALTOU - URL 404)

---
**Veredito do Auditor:** O site precisa de uma camada de semântica técnica (WebMCP Layer) e uma injeção de JSON-LD para ser competitivo no cenário de IA de 2026.
