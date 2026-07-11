# jscodeshift-typescript-example

- [TypeScript all the way 🚀](#typescript-all-the-way-)
- [TypeScript transformer](#typescript-transformer)
- [Use `/jscodeshift` SKILL to create your codemod 🤖](#use-jscodeshift-skill-to-create-your-codemod-)
- [Installation](#installation)
- [Run a codemod](#run-a-codemod)
- [Test](#test)
- [Test and Debug with Vitest](#test-and-debug-with-vitest)
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

## Use `/jscodeshift` SKILL to create your codemod 🤖

Start in [**Plan Mode**](https://code.visualstudio.com/docs/agents/planning) and use example prompt to create a new transform with tests:

``````prompt
/jscodeshift

Create new codemod to migrate lodash imports to use deep imports

before:
```ts
import { pluck } from 'lodash';
```

after:
```ts
import pluck from 'lodash/pluck';
```

``````

## Installation

```shell
npm i
```

## Run a codemod

```shell
npx jscodeshift -t ./src/simple-rename.ts --extensions=ts --parser=ts **/*.ts --print --dry
```

> _Omit `--dry` to write the transformed source back to disk._

## Test

```shell
npm test
```

## Test and Debug with Vitest

Install the [Vitest VSCode extension](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) to test and debug your transformer.

![jscodeshift-vitest](https://raw.githubusercontent.com/chimurai/jscodeshift-typescript-example/main/docs/jscodeshift-vitest.gif)

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
