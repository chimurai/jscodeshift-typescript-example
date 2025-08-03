# jscodeshift-typescript-example

- [TypeScript all the way 🚀](#typescript-all-the-way-)
- [TypeScript transformer](#typescript-transformer)
- [Vibe Code Your `jscodeshift` Codemod 🤖](#vibe-code-your-jscodeshift-codemod-)
- [Installation](#installation)
- [Run a codemod](#run-a-codemod)
- [Test](#test)
- [Debug](#debug)
- [Behind the scenes](#behind-the-scenes)
- [Resources \& Inspiration](#resources--inspiration)
- [Awesome lists](#awesome-lists)


## TypeScript all the way 🚀

Example usage of [jscodeshift](https://github.com/facebook/jscodeshift) _for_ TypeScript _with_ TypeScript:

- TypeScript target files *.ts
- TypeScript transformer
- TypeScript test files
- TypeScript fixtures

## TypeScript transformer

Strongly typed code and code completion with `@types/jscodeshift`

![code-completion](https://raw.githubusercontent.com/chimurai/jscodeshift-typescript-example/main/docs/code-completion.gif)

## Vibe Code Your `jscodeshift` Codemod 🤖

With [`.github/copilot-instructions.md`](.github/copilot-instructions.md) and [`.github/prompts/new-transformer.prompt.md`](.github/prompts/new-transformer.prompt.md) you can vibe code your jscodeshift codemod.

Example prompt to create a new transform with tests:

``````prompt
Create a new transform to add a post-fix "funny" to class name

before:
```ts
class Foo {}
```

after:
```ts
class FooFunny {}
```

``````

## Installation

```shell
npm i
```

## Run a codemod

```shell
npx jscodeshift -t ./examples/simple-rename.ts --extensions=ts --parser=ts **/*.ts --print --dry
```

> _Omit `--dry` to write the transformed source back to disk._

## Test

```shell
npm test
```

## Debug

Use the [pre-configured VSCode launcher](https://github.com/chimurai/jscodeshift-typescript-example/blob/main/.vscode/launch.json) to run tests and debug your transformer.

![debugger](https://raw.githubusercontent.com/chimurai/jscodeshift-typescript-example/main/docs/debugger.gif)

## Behind the scenes

Use `@typescript-eslint/parser` in [https://astexplorer.net](https://astexplorer.net) when working with the jscodeshift's `parser="ts"`

By default jscodeshift will use the [`babel` parser](https://github.com/facebook/jscodeshift#usage-cli) (`@babel/parser`)

## Resources & Inspiration

- <https://github.com/facebook/jscodeshift/tree/master/sample>
- <https://github.com/facebook/jscodeshift/blob/master/recipes/retain-first-comment.md>
- <https://github.com/elliottsj/jscodeshift-typescript-example>
- <https://astexplorer.net>

## Awesome lists

- <https://github.com/rajasegar/awesome-codemods>
- <https://github.com/sejoker/awesome-jscodeshift>
