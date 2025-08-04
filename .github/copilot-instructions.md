This project contains TypeScript jscodeshift codemod examples.
The examples can be found in the `examples` directory along with their corresponding tests.

# Dependencies
- Use `npm` as the package manager.
- Use `jscodeshift` for code transformations.
- Use #context7-mcp to get more information about `jscodeshift` library.
- Use `outdent` for formatting multiline strings in tests.
- Use Vitest for testing the transformations.

# Writing Transformations
- Use `jscodeshift` with TypeScript parser (`parser: 'ts'`) for all transformations.
- `jscodeshift` transformations are written in the `examples` directory.
- Use `simple-rename.ts` and `simple-rename.spec.ts` as a template for writing new transformations.
- Always export parser as `export const parser: TestOptions['parser'] = 'ts';` to ensure TypeScript parsing.

# Abstract Syntax Tree (AST)
- Use TypeScript ESTree node types (e.g., `VariableDeclaration`, `Identifier`) instead of generic AST types to access nodes.
- Access TypeScript-specific nodes like interfaces, type aliases, and decorators using TSESTree types (e.g., `TSInterfaceDeclaration`, `TSTypeAliasDeclaration`, `Decorator`).
- For TypeScript-specific syntax (generics, type annotations), use TSESTree node properties
- Use #context7-mcp (`typescript-eslint/typescript-eslint`) to get more information about ESTree and TSESTree node types.

# Testing Transformations
- Write tests with Vitest.
- Use `npx vitest run` to run the tests without watching.
- Each transformation has a corresponding test file in the `examples` directory. (use *.spec.ts convention)
- Tests use `createTestTransform` to apply the transformation `input` and check the `output`.
- Use `outdent` tagged template literals to format multiline strings in the `input` and `output`.
- Update `expected` transformation output in case of whitespace formatting issue in test

# Git
- Use conventional commits for commit messages.

# GitHub Pull Requests
- Use conventional commits style to describe PR titles
