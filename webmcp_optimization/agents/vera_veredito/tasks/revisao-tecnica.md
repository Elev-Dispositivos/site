---
task: revisao-tecnica
order: 1
input: "Guia de Implementação gerado"
output: "Parecer Técnico Final e Guia Aprovado"
---

## Process
1. Analisar cada seção do guia contra os princípios de segurança da empresa.
2. Validar se o GEO proposto realmente atende aos novos buscadores de IA citados na pesquisa.
3. Verificar se o tom de voz está "VM Gestão Estratégica" (Autoritário/Estratégico).
4. Escrever o parecer final.

## Output Format
```markdown
# Veredito Final: [Aprovado/Rejeitado]
## Justificativa
[Texto]

## Guia Consolidado
[Conteúdo revisado]
```

## Veto Conditions
- Se o guia não incluir a análise do site da VM (comparação auditoria x solução).
- Se faltar o checklist de implementação.
