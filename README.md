# jscodeshift-typescript-example

## TypeScript all the way

Example usage of jscodeshift with TypeScript:

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
npx jscodeshift -t ./src/simple-rename.ts --extensions=ts --parser=ts './**/*.ts' --print --dry
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

Use pre-configured VSCode launcher to run test and debug code.

![debugger](https://raw.githubusercontent.com/chimurai/jscodeshift-typescript-example/main/docs/debugger.gif)

## Behind the scenes

Make sure to use the `@babel/parser`, when working with TypeScript files (`--parser=ts`) in [https://astexplorer.net/](https://astexplorer.net).
