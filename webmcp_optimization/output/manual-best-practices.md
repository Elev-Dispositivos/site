# Manual de Melhores Práticas: WebMCP & GEO (Edição 2026)

Este manual documenta os padrões técnicos para a **Agentic Web**, com foco na especificação **WebMCP (W3C Draft Março/2026)** e técnicas de **GEO (Generative Engine Optimization)** para maximizar o ranqueamento e a utilidade do site `VM Gestão Estratégica` para agentes de IA.

---

## 1. O Protocolo WebMCP (Web Model Context Protocol)

O WebMCP permite que um site exponha funcionalidades internas diretamente para IAs, eliminando a fragilidade do scraping manual.

### 1.1 APIs do Navegador (Imperativo)

Os desenvolvedores devem utilizar a nova interface `navigator.modelContext` para registrar ferramentas dinâmicas.

**Padrão de Registro:**
```javascript
if ('registerTool' in navigator) {
  navigator.registerTool({
    name: 'analisar_risco_passivo',
    description: 'Calcula o risco financeiro e jurídico de dívidas empresariais.',
    parameters: {
      type: 'object',
      properties: {
        valor_divida: { type: 'number', description: 'Valor total em Reais' },
        tipo_credor: { enum: ['banco', 'fisco', 'fornecedor'] }
      },
      required: ['valor_divida', 'tipo_credor']
    },
    handler: async (args) => {
      // Integração com a lógica de negócio da VM
      return await VM_Core.calculateRisk(args);
    }
  });
}
```

### 1.2 Atributos HTML (Declarativo)

Para formulários estáticos, o WebMCP 2.0 introduz atributos que tornam a intenção da página explícita:

| Atributo | Finalidade | Exemplo |
| :--- | :--- | :--- |
| `tool-name` | Nome único da ação | `tool-name="contato_estrategico"` |
| `tool-description` | O que a ferramenta faz | `tool-description="Envia solicitação de análise"` |
| `tool-schema` | Referência para o schema JSON | `tool-schema="/schemas/contato.json"` |

---

## 2. GEO: Generative Engine Optimization

Para que IAs como Gemini, ChatGPT e Perplexity recomendem a VM, o site deve seguir a estrutura de **Alta Densidade Semântica**.

### 2.1 Padrão Answer-First (A1)
IAs em 2026 priorizam conteúdos que respondem à dúvida do usuário nos primeiros 200 caracteres da página. 
- **Regra:** Nunca comece com "Olá, bem-vindo". Comece com a solução direta do problema.

### 2.2 JSON-LD & Entity Linking
Utilize o Schema.org para ligar a VM a entidades de autoridade no setor jurídico/financeiro.
```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "VM Gestão Estratégica",
  "knowsAbout": ["Debt Restructuring", "Tax Law", "Corporate Finance"],
  "description": "Especialista em reestruturação de passivos bancários e tributários."
}
```

---

## 3. Autonomia de Agente em Formulários

Para que agentes consigam preencher formulários com 100% de sucesso:

1. **Associação Explícita**: Sempre use `<label for="...">`. Agentes de 2026 ignoram placeholders como fonte única de informação.
2. **Dicas de Contexto**: Use `data-agent-hint` para fornecer detalhes sobre o formato esperado (Ex: "Formato: DD/MM/AAAA").
3. **Feedback de Estado**: Use `aria-live="polite"` para informar ao agente quando o processamento terminou, evitando que ele aborte a conexão prematuramente.

---

## 4. Segurança: Human-in-the-Loop

Implementações WebMCP devem sempre exigir confirmação visual para ações que:
- Envolvam pagamentos.
- Alterem dados sensíveis do cliente.
- Disparem comunicações em massa.

---
**Documentação gerada por:** 🔍 Rafaela Referência
**Data:** 15 de Março de 2026
**Status:** Versão Final para Implementação
