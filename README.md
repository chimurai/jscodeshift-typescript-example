# jscodeshift-typescript-example

## TypeScript all the way 🚀

Example usage of [jscodeshift](https://github.com/facebook/jscodeshift) _for_ TypeScript _with_ TypeScript:

- TypeScript target files *.ts
- TypeScript transformer
- TypeScript test files
- TypeScript fixtures

## TypeScript transformer

Strongly typed code and code completion with `@types/jscodeshift`

![code-completion](https://raw.githubusercontent.com/chimurai/jscodeshift-typescript-example/main/docs/code-completion.gif)

## Installation

```shell
npm i
```

or

```shell
yarn
```

## Run codemod

```shell
npx jscodeshift -t ./examples/simple-rename.ts --extensions=ts --parser=ts './**/*.ts' --print --dry
```

> _Omit `--dry` to write the transformed source back to disk._

## Test

```shell
npm test
```

or

```shell
yarn test
```

## Debug

Use the [pre-configured VSCode launcher](https://github.com/chimurai/jscodeshift-typescript-example/blob/main/.vscode/launch.json) to run tests and debug your transformer.

![debugger](https://raw.githubusercontent.com/chimurai/jscodeshift-typescript-example/main/docs/debugger.gif)

## Behind the scenes

Use `@babel/parser` in [https://astexplorer.net](https://astexplorer.net) when working with the jscodeshift's [default parser](https://github.com/facebook/jscodeshift#usage-cli) (default: `babel`).

## Resources & Inspiration

- <https://github.com/facebook/jscodeshift/tree/master/sample>
- <https://github.com/facebook/jscodeshift/blob/master/recipes/retain-first-comment.md>
- <https://github.com/elliottsj/jscodeshift-typescript-example>
- <https://astexplorer.net>

## Awesome lists

- <https://github.com/rajasegar/awesome-codemods>
- <https://github.com/sejoker/awesome-jscodeshift>
