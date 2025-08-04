import { describe, it, expect } from 'vitest';
import outdent from 'outdent';
import { createTestTransform } from './test-kit';
import transformer from './reverse-identifiers';

describe("reverse-identifiers", () => {
  const transform = createTestTransform(transformer)

  it('should reverse the names of all identifiers', () => {
    const source = outdent`
      const firstWord = 'Hello ';
      const secondWord = 'world';
      const message = firstWord + secondWord;

      const getMessage = (): string => message;
    `;

    const expected = outdent`
      const droWtsrif = 'Hello ';
      const droWdnoces = 'world';
      const egassem = droWtsrif + droWdnoces;

      const egasseMteg = (): string => egassem;
    `;

    expect(transform({ source })).toEqual(expected);
  })
});
