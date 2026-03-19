# Guia de Implementação: VM Web-Ready 2026

Este guia fornece os passos técnicos necessários para adequar o site da **VM Gestão Estratégica** ao padrão **WebMCP 2.0** e maximizar o ranqueamento em motores de IA via **GEO**.

---

## 1. Otimização GEO (Visibilidade para IA)

A ausência de dados estruturados impede que IAs "indexem fatos" sobre a VM. Precisamos injetar JSON-LD em todas as páginas.

### 1.1 JSON-LD Organizacional (Adicionar ao `<head>` da Home)
Este script define quem é a VM e quais são suas especialidades para LLMs.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "VM Gestão Estratégica",
  "url": "https://vmgestaoestrategica.com.br/",
  "logo": "https://vmgestaoestrategica.com.br/assets/logo.png",
  "knowsAbout": [
    "Reestruturação de Passivos Bancários",
    "Gestão Tributária Empresarial",
    "Consultoria Preventiva Jurídica"
  ],
  "description": "Consultoria especializada na reestruturação estratégica de passivos empresariais, atuando na esfera administrativa e judicial.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Porto Alegre",
    "addressRegion": "RS",
    "addressCountry": "BR"
  }
}
</script>
```

---

## 2. Implementação WebMCP (Formulários Autônomos)

Vamos transformar os formulários em "Ferramentas" que agentes de IA podem preencher sozinhos.

### 2.1 Simulador de Revisão da Dívida
**Local:** Home
**Ação:** Adicionar atributos WebMCP e tags de label.

```html
<!-- HTML Atualizado -->
<form tool-name="simular_revisao_divida" tool-description="Simula o valor de revisão de dívidas bancárias e tributárias.">
  <label for="sim-valor">Valor da Dívida (R$)</label>
  <input id="sim-valor" type="number" step="0.01" tool-description="Valor total consolidado da dívida" required />

  <label for="sim-tipo">Tipo de Credor</label>
  <select id="sim-tipo" tool-description="Tipo de instituição credora">
    <option value="banco">Instituição Bancária</option>
    <option value="fisco">Fisco (Tributário)</option>
  </select>
  
  <button type="submit" tool-action="Calcula diagnóstico preliminar">Simular Agora</button>
</form>
```

### 2.2 Formulário de Contato
**Local:** Home /#contato
**Ação:** Mapeamento de campos para preenchimento por agentes.

```html
<form tool-name="enviar_lead_consultoria" tool-description="Envia dados para análise de passivo empresarial.">
  <label for="nome">Nome Completo</label>
  <input id="nome" type="text" tool-description="Nome do responsável" required />
  
  <label for="email">E-mail Corporativo</label>
  <input id="email" type="email" tool-description="E-mail para retorno técnico" required />
  
  <label for="telefone">WhatsApp/Telefone</label>
  <input id="telefone" type="tel" data-agent-hint="Inclua o DDD" required />

  <button type="submit" tool-action="Envia lead para reestruturação">Solicitar Consultoria</button>
</form>
```

---

## 3. Checklist de Implementação para o Time de TI

1. [ ] **Correção de URL**: Criar um redirecionamento 301 de `/contato/` para mapping `/#contato` ou criar a página física para evitar o erro 404 detectado.
2. [ ] **Filtros de Serviços**: Adicionar `aria-pressed="true/false"` dinamicamente aos botões de filtro na página de serviços.
3. [ ] **Injeção de Scripts**: Adicionar os blocos JSON-LD no `<head>`.
4. [ ] **WebMCP Layer**: Incluir os atributos `tool-name` e `tool-description` em todos os inputs dos formulários.

---
**Elaborado por:** ✍️ Guilherme Guia
**Data:** 15 de Março de 2026
