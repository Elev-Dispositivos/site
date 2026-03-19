---
task: mapear-specs
order: 1
input: "Nada (Pesquisa Web inicial)"
output: "Manual de Melhores Práticas WebMCP 2.0"
---

## Process
1. Usar `web_search` para encontrar o rascunho mais recente da especificação WebMCP 2.0.
2. Investigar como os agentes do Google, OpenAI e Anthropic (em 2025-2026) estão indexando conteúdos através do GEO.
3. Listar os tipos de dados estruturados (Schema.org) que mais influenciam o ranqueamento em motores generativos.
4. Definir o padrão de "Tool Contracts" para formulários (inputs, buttons, validation).

## Output Format
```yaml
best_practices:
  webmcp_version: "2.0"
  core_api_methods: [list]
  html_attributes:
    attribute_name: description
  geo_ranking_factors:
    - factor: description
  code_snippets:
    - pattern: code
```

## Output Example
### Guia de Referência WebMCP 2.0
- **Attribute:** `tool-name`
  - **Purpose:** Identifica a ação para o agente.
- **GEO Factor:** `Semantic Density`
  - **Impact:** Melhora a compreensão do LLM sobre o nicho da empresa.

## Quality Criteria
- Mínimo de 10 atributos técnicos listados.
- Seção dedicada a formulários autônomos.

## Veto Conditions
- Se recomendar técnicas de SEO de 2023 (keyword stuffing).
- Se falhar em mencionar a API de ferramentas nativa do browser.
