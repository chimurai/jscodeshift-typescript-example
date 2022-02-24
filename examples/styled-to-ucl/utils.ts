import { Expression } from 'jscodeshift';

const expressionTypes = {
  MemberExpression: (expression) => ({
    value: expression,
    tag: '',
    vars: null,
  }),
  ArrowFunctionExpression: (expression) => {
    // We need to remove arrow functions
    return {
      value: expression.body,
      tag: '',
      vars: [],
    }
  },
};

export const parseExpression = (expression: Expression) => {
  const fn = expressionTypes[expression.type];
  if (!fn) {
    throw new Error(`type ${expression.type} not found`);
  }
  return fn(expression);
}
