# Quality Criteria: WebMCP & GEO Optimization

## Technical Scores
Each page or feature implementaton is scored from 0-10 based on:

### 1. Discoverability (30%)
- [ ] Site manifest (`/agentic-manifest.json`) exists and is valid.
- [ ] `navigator.modelContext` returns at least 3 core business tools.
- [ ] Schema.org tags are present on every service page.

### 2. Form Autonomy (40%)
- [ ] Forms are 100% submission-ready for agents without human clicks.
- [ ] Error messages are mapped to `aria-errormessage`.
- [ ] Success callbacks provide a machine-readable summary of the action taken.

### 3. GEO Ranking (30%)
- [ ] Content uses the "Inverted Pyramid" structure.
- [ ] Presence of original legal/financial claims backed by external data links.
- [ ] No "fluff" or generic SEO filler text that confuses LLM embeddings.

## Pass/Fail Thresholds
- **Critical**: Missing Tool Contracts on "Lead Gen" forms = FAIL.
- **Important**: Missing ARIA states on dynamic inputs = WARNING.
- **Minor**: Missing brand-specific terminology in meta tags = ADVISORY.
