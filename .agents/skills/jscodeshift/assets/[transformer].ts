import type { API, FileInfo } from 'jscodeshift';
import type { TestOptions } from 'jscodeshift/src/testUtils';

/**
 * [Transformer description]
 *
 * ```ts
 * // before
 * [example code snippet]
 * ```
 *
 * ```ts
 * // after
 * [example code snippet]
 * ```
 *
 * @license MIT
 * @copyright [current year] - Created with https://github.com/chimurai/jscodeshift-typescript-example
 * @description Run this transformer with jscodeshift: `npx jscodeshift -t src/[transformer].ts <path/glob-to-files> --print --dry`
 */
export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  return root.toSource();
}

// Use TypeScript parser for transformations
export const parser: TestOptions['parser'] = 'ts';
