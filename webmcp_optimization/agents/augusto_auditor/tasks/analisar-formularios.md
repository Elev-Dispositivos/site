---
task: analisar-formularios
order: 2
input: "Páginas com formulários detectadas"
output: "Relatório de Autonomia de Agente (Formulários)"
---

## Process
1. Inspecionar cada campo de input dos formulários do site.
2. Verificar se o botão de submit é acessível via seletor semântico.
3. Validar se há labels explícitos vinculados via `for`.
4. Checar se existem atributos do WebMCP (mesmo que parciais).

## Output Format
```yaml
forms_analysis:
  form_id: name
  fields:
    - field_name: label_status
  agent_readiness_score: 0-10
  required_changes: [list]
```

## Veto Conditions
- Se ignorar campos obrigatórios que não estão sinalizados no código.
- Se não sugerir o `tool-name` para o formulário.
