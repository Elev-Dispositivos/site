# Research Brief: WebMCP 2.0 & GEO Optimization (2025-2026)

## Overview
This brief summarizes the technical landscape of WebMCP 2.0 and Generative Engine Optimization (GEO) as of early 2026. The shift is from a "read-only" web to an "action-oriented" web where AI agents are the primary users.

## 1. WebMCP 2.0 Standards
WebMCP (Web Model Context Protocol) allows websites to expose their inner workings to AI agents as structured "tools."

### Core Concepts
- **Tool Contracts**: JSON/YAML schemas that describe a function's name, description, required arguments, and expected output.
- **Navigator API**: New browser-native API (`navigator.registerTool`) for real-time tool registration.
- **Declarative Actions**: Using `tool-name`, `tool-description`, and `tool-schema` attributes directly in HTML tags (especially forms).
- **Dual Flow**: 
  - **Declarative**: For simple form submissions and searches.
  - **Imperative**: For complex workflows (e.g., pricing calculators, multi-step wizards) handled via JavaScript.

### Security & Privacy
- **User-in-the-loop**: Explicit user confirmation for "impactful" tools (payments, data deletion).
- **Browser-Locked Sessions**: Agents inherit the user's cookies/auth state automatically.

## 2. GEO (Generative Engine Optimization)
GEO is the evolution of SEO for LLMs (Large Language Models).

### Key Ranking Factors for IA
1. **Citation Authority**: How often the brand is cited by AI as a primary source for specific expertise.
2. **Contextual Freshness**: Rapidly updating site content to maintain relevance in AI training/real-time search windows.
3. **Structured Entity Relationship**: Using Schema.org to explicitly link the brand to "entities" (Ex: "VM Gestão Estratégica" linked to "Debt Restructuring Specialist").
4. **Machine-Readable Summaries**: Providing concise (inverted pyramid) summaries at the top of long pages.

## 3. Automation-Ready Form Practices
- **Explicit Labeling**: Every input must have a `<label for="...">` or `aria-label`.
- **ARIA States**: Using `aria-invalid`, `aria-busy`, and `aria-live` to tell agents what is happening during submission.
- **Action Semantics**: Buttons must have clear roles (`type="submit"`) and descriptive text.
- **Validation Schemas**: Exposing client-side validation logic via WebMCP schemas so the agent can fix errors BEFORE submission.
