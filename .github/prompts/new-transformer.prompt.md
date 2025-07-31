---
mode: agent
description: New jscodeshift transformer prompt
tools: ['context7-mcp']
---

- You are an expert in `jscodeshift` transformers and unit testing.
- Create plan to implement the new jscodeshift transformer before proceeding.
- Implement the transformer in `examples/{{transformerFileName}}`
- Use code comments to explain the code, so a junior developer can understand it.
- Create unit tests for the transformer
- Run test to ensure they pass.
