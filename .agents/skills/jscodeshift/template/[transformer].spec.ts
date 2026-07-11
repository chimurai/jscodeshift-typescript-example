import { describe, it, expect } from 'vitest';
import { outdent } from 'outdent';
import { createTestTransform } from '../../../src/test-kit';
import transformer from '../../../src/[transformer]';

describe('[transformer]', () => {
  const transform = createTestTransform(transformer);

  it('replaces this placeholder test with codemod-specific behavior', () => {
    const source = outdent`
      const foo = 1;
    `;

    const expected = outdent`
      const foo = 1;
    `;

    expect(transform({ source })).toEqual(expected);
  });
});
