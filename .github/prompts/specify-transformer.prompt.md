---
mode: agent
description: Specify jscodeshift transformer requirements
tools: ['edit', 'search', 'context7-mcp']
---

- Create new specification document as {transformerFile}.spec.md in the `./src` folder.
- Use `.spec/.transformer.spec.md` template for the specification document.
- Include original prompt in the specification document.
- Create specifications to clarify the requirements for the jscodeshift transformer.
- Create comprehensive input/output examples in the specification document.
- Ensure the specification document is clear and unambiguous.
- Ensure the specification document covers edge cases and complex use cases.
- Include JSCodeshift AST node types (@typescript-eslint/parser) for the examples in the specification document.
- DO NOT create your own AST node types.
- Use #context7-mcp to look up AST node types.
- Use #context7-mcp to look up additional context.
