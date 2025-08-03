This project contains TypeScript jscodeshift codemod examples.
The examples can be found in the `examples` directory along with their corresponding tests.

# Dependencies
- Use `npm` as the package manager.
- Use `jscodeshift` for code transformations.
- Use #context7-mcp to get more information about `jscodeshift` library.
- Use `outdent` for formatting multiline strings in tests.
- Use Vitest for testing the transformations.

# Writing Transformations
- `jscodeshift` transformations are written in the `examples` directory.
- Use `simple-rename.ts` and `simple-rename.spec.ts` as a template for writing new transformations.
- Always export parser as `export const parser: TestOptions['parser'] = 'ts';` to ensure TypeScript parsing.

# Abstract Syntax Tree (AST)
- Use `jscodeshift` to traverse and manipulate the AST.
- Use TypeScript ESTree (`typescript-eslint`) for transformations when `parser='ts'`.
- Use #context7-mcp to understand the different AST nodes

# Testing Transformations
- Write tests with Vitest.
- Use `npx vitest run` to run the tests without watching.
- Each transformation has a corresponding test file in the `examples` directory. (use *.spec.ts convention)
- Tests use `createTestTransform` to apply the transformation `input` and check the `output`.
- Use `outdent` tagged template literals to format multiline strings in the `input` and `output`.
