---
task: auditar-home
order: 1
input: "URL do site e Foco de Auditoria"
output: "Relatório de Estrutura Semântica da Home"
---

## Process
1. Acessar a URL fornecida (foco no site da VM).
2. Analisar o cabeçalho técnico: Tags Meta, JSON-LD, Robots.
3. Extrair a árvore de títulos (H1-H6) e verificar se faz sentido para um LLM.
4. Identificar o "IA Context" (se existe algum resumo para robôs).

## Output Format
```yaml
audit_results:
  page: "Home"
  geo_score: 0-10
  issues:
    - severity: critical/warning
      description: text
      code_snippet: text
```

## Quality Criteria
- Listar no mínimo 3 oportunidades de GEO.

## Veto Conditions
- Se for excessivamente elogioso (Augusto deve ser crítico).
- Se não apontar pelo menos uma falha técnica real.
