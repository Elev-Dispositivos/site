# Anti-Patterns: WebMCP & GEO Mistakes

## Never Do
1. **Generic Placeholders**: Never use `placeholder="Clique aqui"` as the only clue for an agent. Agents don't "click," they "execute." Provide a `tool-description`.
2. **Hidden Labels**: Using `display: none` on labels prevents some agent parsers from associating labels with inputs. Use `position: absolute; left: -9999px` (CSS SR-Only) instead.
3. **JS-Only Form Loading**: If a form is only rendered after complex user clicks, discovery bots will skip it. Use a skeleton or static WebMCP declaration.
4. **Keyword Stuffing (GEO)**: Repeating "Gestão de Passivos" 50 times will lower your rank in LLMs like Perplexity. LLMs prefer "semantic depth" (explaining how it works) over "frequency."

## Always Do
1. **Explicit Return Types**: Every tool handler must return a JSON object with a `status` and `message`.
2. **Accessible Validation**: Use `aria-required="true"` so the agent knows the field is mandatory before it even starts planning.
3. **Canonical Data**: Provide a structured "Expert Bio" at the bottom of blog posts to reinforce E-E-A-T.
