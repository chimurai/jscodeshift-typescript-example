import { describe, it, expect } from 'vitest';
import { createTestTransform } from './test-kit';
import transformer from './simple-rename';

describe("simple-rename", () => {
  const transform = createTestTransform(transformer)

  it('should rename variable "foo" to "bar"', () => {
    const source = `const foo = 123;`
    const expected = `const bar = 123;`
    expect(transform({source})).toEqual(expected);
  })
});
