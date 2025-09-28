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
- Use explicit `return file.source;` when no transformation is needed, instead of using `toSource()`.

### Code Style for Transformations
- Use descriptive variable names that reflect AST node types (e.g., `functionPath`, `importDecl`)
- Group related operations together (find → validate → transform → replace)
- Extract complex logic into helper functions (avoid using `any` on arguments for type safety)
- Add comments explaining complex AST manipulations
- Use early returns to reduce nesting

### Transformation Best Practices
- **Idempotency**: Ensure transformations can be run multiple times safely without changing already-transformed code.
- **Specificity**: Make transformations as specific as possible to avoid unintended changes.
- **Early returns**: Return early when no changes are needed to improve performance.
- **Validation**: Always validate that nodes match expected patterns before transforming.
- **Preserve formatting**: Use `.replaceWith()` instead of manual string manipulation when possible.

### Common AST Patterns
- **Finding nodes**: Use `.find()` with specific node types and filters
- **Type checking**: Always check `node.type` before accessing type-specific properties
- **Path operations**: Use `path.value` to access the node, `path.scope` for scope info
- **Building nodes**: Use `j.identifier()`, `j.callExpression()`, etc. to create new nodes
- **Replacing nodes**: Use `path.replace()` or `collection.replaceWith()` for replacements

## Abstract Syntax Tree (AST)
- Use `jscodeshift` API to traverse and manipulate the AST.
- When using TypeScript parser (`parser: 'ts'`), jscodeshift uses `@typescript-eslint/parser` internally.
- For TypeScript-specific transformations, always check node types before accessing TS-specific properties.
- Use #context7-mcp to find ESTree and TSESTree node types from `@typescript-eslint/parser`.

### AST Debugging & Exploration
- Make sure to use the same parser as in the transformer for accurate AST representation.
- Use `console.log(JSON.stringify(path.value, null, 2))` to inspect node structure
- Use `j(node).toSource()` to see how a node would be rendered as code
- Check `path.parentPath` and `path.scope` for context information
- Use `.filter()` to narrow down collections before debugging specific nodes

## Testing Transformations
- Use `npm test` to run tests.
- Write tests using Vitest.
- Use `*.spec.ts` filename convention.
- Each transformation has a corresponding test file in the `src` folder.
- Tests use `createTestTransform` to apply the transformation `input` and validate the `output`.
- Example assertion: `expect(testTransform({ source: input })).toBe(expected);`
- Use `outdent` tagged template literals to format multiline strings in the `input` and `output`.
- Update `expected` transformation output in case of formatting issue in test output.
