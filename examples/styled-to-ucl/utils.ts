import { JSCodeshift } from 'jscodeshift';

const styleColorMap = {
  'black': 'black',
}

const stylesToValue = (j: JSCodeshift, group, value) => {

  console.log(`group: `, group);
  console.log(`value: `, value);
  switch (group) {
    case 'color':
      return j.stringLiteral(styleColorMap[value]);

    default:
      break;
  }
  return;
};

const valueToType = (j: JSCodeshift, value) => {
  switch (typeof value) {
    case 'string':
      return j.tsStringKeyword();
    case 'number':
      return j.tsNumberKeyword();
    case 'boolean':
      return j.tsBooleanKeyword();

    default:
      return j.tsBooleanKeyword();
    // throw new Error('valueToType not found: ' + value)
  }
}


interface IMapping {
  component: string;
}

const elementMap: Record<string, IMapping> = {
  'div': {
    component: 'Box',
  },
  'h1': {
    component: 'Header'
  },
  'h2': {
    component: 'Header'
  }
};

export const getElementMapping = (el: string) => {
  const found = elementMap[el];

  if (!found) {
    throw new Error('element not found: ' + el);
  }
  return found;
}

export const parseExpression = (j: JSCodeshift, expression) => {
  const finalVars = [];
  let finalValue;
  if (expression.type === 'MemberExpression') {
    let v = expression;
    // TODO maps styles or maybe more this to a separate code mod
    // remove Styles
    let isAGlobal = false;
    console.log(`expression: `, expression);
    if (expression?.object?.object?.name === 'Styles') {
      isAGlobal = true;
      // v = stylesToValue(j, expression.object.property.name, expression.property.name);
    }
    const propertyName = expression?.property?.name;
    console.log(`propertyName: `, propertyName);
    finalValue = expression;
    let vars;
    if (propertyName && !isAGlobal) {
      vars = [{
        name: propertyName,
        type: valueToType(j, propertyName),
      }];
    }
    return {
      value: v,
      vars,
    }
  }
  if (expression.type === 'ArrowFunctionExpression') {
    // And change `props` to `p`
    if (expression.body?.object?.name === 'props') {
      expression.body.object.name = 'p';
    }
    const { value, vars } = parseExpression(j, expression.body);
    expression.body = value;
    finalValue = expression.body;
    if (vars?.length) finalVars.push(vars);
    return {
      value: expression.body,
      vars,
    }
  }

  if (expression.type === 'ConditionalExpression') {
    const consequent = parseExpression(j, expression.consequent);
    expression.consequent = consequent.value;
    const alternate = parseExpression(j, expression.alternate);
    expression.alternate = alternate.value;
    const conditionalVar = expression?.test?.property?.name
    let localVars = [];
    if (conditionalVar) {
      localVars.push({
        name: conditionalVar,
        type: j.tsBooleanKeyword(),
      })
    }
    return {
      value: expression,
      vars: [
        ...(localVars || []),
        ...(consequent.vars || []),
        ...(alternate.vars || []),
      ]
    }
  }

  if (expression.type === 'CallExpression') {
    // Check for tokens
    if (expression?.callee?.property?.name === 'token') {
      // if one is found then we should return a string instead of an arrow function
      // We also don't care about types in that case
      return {
        value: j.stringLiteral('__legacyToken.' + expression.arguments[0]?.value),
        vars: null,
      }
    } else {
      // on all other call expressions we want the name of the property so that we can
      // add it to the types
      const propertyName = expression?.property?.name;
      console.log(`propertyName: `, propertyName);
      return {
        value: expression,
        vars: [{
          name: propertyName,
          type: valueToType(j, propertyName),
        }],
      }
    }
  }
  throw new Error('Expression not implemented type: ' + expression.type)
};
