# Domain Framework: WebMCP Tooling Architecture

## Introduction
This framework defines how to implement WebMCP 2.0 and GEO-ready structures for corporate websites.

## 1. The Tool Contract Registry
Every interactive feature on the site should be registered in a manifest.

### Implementation Pattern:
```javascript
// Example: Registering a Debt Analysis Tool
if ('registerTool' in navigator) {
  navigator.registerTool({
    name: 'analyze_debt_risk',
    description: 'Computes legal and financial risk score for business debt based on total value and creditor type.',
    parameters: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Total debt value in BRL' },
        creditor_type: { enum: ['bank', 'government', 'private'], description: 'Type of creditor' }
      },
      required: ['amount', 'creditor_type']
    },
    handler: async (args) => {
      // Calls existing frontend logic
      return await window.VM_Logic.calculate(args);
    }
  });
}
```

## 2. Semantic Markup Hierarchy
For AI to rank content (GEO), follow the **Answer First (A1)** pattern.

- **Level 1 (Direct Answer)**: Use a `<div>` with `id="ia-snippet"` and `role="doc-abstract"` containing the 2-3 sentence answer to the page's primary query.
- **Level 2 (Structured Evidence)**: Use semantic tables and definition lists (`<dl>`, `<dt>`, `<dd>`) for specifications.
- **Level 3 (Entity Linking)**: JSON-LD script identifying the organization and the author's expertise.

## 3. Autonomous Form Schema
When an AI agent encounters a form:
1. It looks for the `<form>` attribute `webmcp-tool="[name]"`.
2. It fetches the schema from the associated script.
3. It maps its available context (user data) to the fields.

### Best Practice:
- Use `data-agent-hint` on inputs to guide the AI. 
- Example: `<input name="phone" data-agent-hint="Include country code (+55)">`
