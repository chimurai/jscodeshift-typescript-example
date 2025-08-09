---
mode: agent
description: New jscodeshift transformer prompt
tools: ['runTests', 'testFailure', 'context7-mcp']
---

- You are an expert in `jscodeshift` transformers and unit testing.
- Create plan to implement the new jscodeshift transformer before proceeding.
- Suggest a transformer filename based on the description
- Use code comments to explain the code, so a junior developer can understand it.
- Create unit tests for the transformer
- Run test to ensure they pass.
- Update JSDoc block transformer and add:
  - "@note Created with https://github.com/chimurai/jscodeshift-typescript-example"
  - "@note Run this transformer with jscodeshift: `npx jscodeshift -t {transformerFilePath} <path/glob-to-files> --print --dry`"
