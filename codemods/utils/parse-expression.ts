import { JSCodeshift } from 'jscodeshift';
import * as _ from 'lodash/fp';
import { brandFontMap, primitiveMap, valueToType } from './mappings';

const isType = (expression, t) =>
  expression?.type === t ||
  expression?.object?.type === t ||
  expression?.object?.object?.type === t;

const isName = (expression, n) =>
  expression?.object?.name === n ||
  expression?.object?.object?.name === n ||
  expression?.object?.object?.object?.name === n;

export const parseExpression = (j: JSCodeshift, expression, localImportNames?: string[]) => {
  const finalVars = [];

  // console.log(`expression.type: `, expression.type);
  if (expression.type === 'MemberExpression') {
    let v = expression;
    let includeTypes = true;

    // check if the expession is an import
    if (_.contains('theme', localImportNames)) {
      includeTypes = false;
    }

    const isMember = isType(expression, 'MemberExpression');
    const isPrimitive = isName(expression, 'primitive');

    if (isPrimitive) {
      includeTypes = false;
    }

    // Local variables
    if (expression?.object?.type === 'Identifier') {
      if (isPrimitive) {
        const foundPrimitive = primitiveMap[expression.property.name];
        if (foundPrimitive) {
          v = j.stringLiteral(foundPrimitive);
          includeTypes = false;
        }
      }
      const isBrandFont = isName(expression, 'brandFont');
      if (isBrandFont) {
        const foundPrimitive = brandFontMap[expression.property.name];
        if (foundPrimitive) {
          v = j.stringLiteral(foundPrimitive);
          includeTypes = false;
        }
      }
    }

    // TODO maps styles or maybe more this to a separate code mod
    // remove Styles
    const isStyles = isName(expression, 'Styles');

    if (isMember && isStyles) {
      includeTypes = false;
      v = expression;
      // TODO
      // v = stylesToValue(j, expression.object.property.name, expression.property.name);
    }

    const propertyName = expression?.property?.name;
    let vars;
    if (propertyName && includeTypes) {
      vars = [
        {
          name: propertyName,
          type: valueToType(j, propertyName),
        },
      ];
    }
    return {
      value: v,
      vars,
    };
  }
  if (expression.type === 'ArrowFunctionExpression') {
    let exp;
    // @ts-ignore
    if (expression?.params?.[0].type === 'ObjectPattern') {
      // convert children to use `p.xxx`
      const vars = expression.params[0].properties?.map(p => p.key.name);
      exp = j.memberExpression(j.identifier('p'), j.identifier(vars[0]));
      // @ts-ignore
      if (expression?.body?.test) {
        expression.body.test = exp;
      }
    }

    // And change `props` to `p`
    if (expression.body?.object?.name === 'props') {
      expression.body.object.name = 'p';
    }
    if (expression.body?.test?.object?.name === 'props') {
      expression.body.test.object.name = 'p';
    }
    const { value, vars } = parseExpression(j, expression.body);
    expression.body = value;
    if (vars?.length) finalVars.push(vars);
    return {
      value: expression.body,
      vars,
    };
  }

  if (expression.type === 'ConditionalExpression') {
    const consequent = parseExpression(j, expression.consequent);
    expression.consequent = consequent.value;
    const alternate = parseExpression(j, expression.alternate);
    expression.alternate = alternate.value;
    const conditionalVar = expression?.test?.property?.name || expression?.test?.name;
    let localVars = [];
    if (conditionalVar) {
      localVars.push({
        name: conditionalVar,
        type: j.tsBooleanKeyword(),
      });
    }
    return {
      value: expression,
      vars: [...(localVars || []), ...(consequent.vars || []), ...(alternate.vars || [])],
    };
  }

  if (expression.type === 'CallExpression') {
    // Check for tokens
    if (expression?.callee?.property?.name === 'token') {
      // if one is found then we should return a string instead of an arrow function
      // We also don't care about types in that case
      return {
        value: j.stringLiteral('__legacyToken.' + expression.arguments[0]?.value),
        vars: null,
      };
    } else {
      // on all other call expressions we want the name of the property so that we can
      // add it to the types
      const propertyName = expression?.property?.name;
      return {
        value: expression,
        vars: [
          {
            name: propertyName,
            type: valueToType(j, propertyName),
          },
        ],
      };
    }
  }

  if (expression.type === 'StringLiteral') {
    return {
      value: j.stringLiteral(expression?.value),
      vars: null,
    };
  }

  if (expression?.type === 'Identifier') {
    return {
      value: expression,
      vars: null,
    };
  }

  throw new Error('Expression not implemented type: ' + expression.type);
};
