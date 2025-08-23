# Project
This project contains TypeScript jscodeshift codemod examples.

## Folder Structure
- `src`: Contains the codemods and their tests.
- `src/simple-rename.ts`: Example codemod that renames a variable.
- `src/simple-rename.spec.ts`: Tests for the `simple-rename` codemod.

## Dependencies
- Use `npm` as the package manager.
- Use `jscodeshift` for code transformations.
- Use #context7-mcp to find `jscodeshift` documentation.
- Use `outdent` for formatting multiline strings in tests.
- Use Vitest for testing the transformations.
- Do NOT install dependencies.

## Writing Transformations
- Use `jscodeshift` with TypeScript parser (`parser: 'ts'`) for all transformations.
- Create new `jscodeshift` transformations in the `src` folder.
- Use `simple-rename.ts` and `simple-rename.spec.ts` as a template for writing new transformations.
- Always export parser as `export const parser: TestOptions['parser'] = 'ts';` to ensure TypeScript parsing.
- Fix all TypeScript Type errors.
- Use Type Narrowing if necessary to ensure type safety.
- Set jscodeshift's `.toSource()` options to match the code style of the examples

## Abstract Syntax Tree (AST)
- Use TypeScript ESTree node types (e.g., `VariableDeclaration`, `Identifier`) instead of generic AST types to access nodes.
- Access TypeScript-specific nodes like interfaces, type aliases, and decorators using TSESTree types (e.g., `TSInterfaceDeclaration`, `TSTypeAliasDeclaration`, `Decorator`).
- For TypeScript-specific syntax (generics, type annotations), use TSESTree node properties
- Use #context7-mcp to find ESTree and TSESTree node types from `typescript-eslint/typescript-eslint`.

## Testing Transformations
- Use `npm test` to run tests.
- Write tests using Vitest.
- Use `*.spec.ts` filename convention.
- Each transformation has a corresponding test file in the `src` folder.
- Tests use `createTestTransform` to apply the transformation `input` and validate the `output`.
- Use `outdent` tagged template literals to format multiline strings in the `input` and `output`.
- Update `expected` transformation output in case of whitespace formatting issue in test

## Git
- Use conventional commits for commit messages.

## GitHub Pull Requests
- Use conventional commits style to describe PR titles
