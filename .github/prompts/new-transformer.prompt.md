---
mode: agent
description: New jscodeshift transformer prompt
tools: ['runCommands', 'edit', 'search', 'context7-mcp/*', 'testFailure']
---

- You are an expert in `jscodeshift` transformers and unit testing.
- Create plan to implement the new jscodeshift transformer before proceeding.
- Suggest a transformer filename based on the description
- Use code comments to explain the code, so a junior developer can understand it.
- Create unit tests for the transformer
- Run tests to ensure they pass.
- Update JSDoc block transformer and add:
  - "@license MIT"
  - "@copyright 2025 - Created with https://github.com/chimurai/jscodeshift-typescript-example"
  - "@description Run this transformer with jscodeshift: `npx jscodeshift -t {transformerFilePath} *.ts --print --dry`"
