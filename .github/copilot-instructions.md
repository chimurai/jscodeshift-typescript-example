This project contains TypeScript jscodeshift codemod examples.
The examples can be found in the `examples` directory along with their corresponding tests.

# Dependencies
- This project uses Yarn as the package manager.
- Install dependencies with `yarn install`.
- The project uses `jscodeshift` for code transformations.
- Use #context7-mcp to get more information about `jscodeshift`.
- The project uses `outdent` for formatting multiline strings in tests.
- Use Vitest for testing the transformations.

# Writing Transformations
- `jscodeshift` transformations are written in the `examples` directory.
- Use `simple-rename.ts` and `simple-rename.spec.ts` as a template for writing new transformations.

# Testing Transformations
- Tests are written with Vitest.
- Use `yarn vitest run` to run the tests without watching.
- Each transformation has a corresponding test file in the `examples` directory. (use *.spec.ts convention)
- The tests use `createTestTransform` to apply the transformation `input` and check the `output`.
- Use `outdent` tagged template literals to format multiline strings in the `input` and `output`.
