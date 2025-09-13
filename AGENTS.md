# jscodeshift-typescript-example project

jscodeshift-typescript-example is a project with `jscodeshift` example codemods for TypeScript.
`jscodeshift` codemods are found in the `src/` folder, along with unit tests and codemod prompt description files

## Architecture
- Use `npm` as dependency manager
- Use Vitest for unit testing

## Build & Commands
- Install deps: `npm install`
- Run tests: `npm test`
- Run single test: `npm test src/simple-rename.spec.ts`

## Code Style
- Spaces for indentation (2 spaces)
- Single quotes, semicolons, trailing commas
- Use descriptive variable/function names

## Testing
- Use Vitest for unit testing
- Test files:  `*.spec.ts`

## Git Workflow
- ALWAYS remove temporary and debug files before committing
- ALWAYS run `npm test` before committing
- NEVER use `git push --force` on the main branch
- Use `git push --force-with-lease` for feature branches if needed
- Use conventional commits style for git commit messages
- Use conventional commits style to describe GitHub PR titles
