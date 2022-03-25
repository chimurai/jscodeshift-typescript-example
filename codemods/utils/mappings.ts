import { JSCodeshift } from 'jscodeshift';
import * as _ from 'lodash/fp';

const numberOrLengthRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)((?:px|rem|%))?$/i;
export const subRegEx = /^(?<pre>.*?)(?<sub>__\d{1,}substitution__)(?<post>.*?)$/i;

const styledComponentsImportsToRemove = ['keyframes'];
export const styledComponentImportFunctionShouldBeRemove = name =>
  _.contains(name, styledComponentsImportsToRemove);

const styleColorMap = {
  black: 'black',
};

export const mediaPropertyNames = {
  mobile: { origProp: 'lg', newProp: 'base' },
  mobileTiny: { origProp: 'lg', newProp: 'base' },
  mobileSmall: { origProp: 'lg', newProp: 'base' },
  mobileFullscreen: { origProp: 'lg', newProp: 'base' },
  mobileLandscape: { origProp: 'lg', newProp: 'base' },
  desktop: { origProp: 'base', newProp: 'lg' },
  desktopLarge: { origProp: 'base', newProp: 'lg' },
};

export const primitiveMap = {
  $spacing0: '$0',
  $spacing1: '$1',
  $spacing2: '$2',
  $spacing3: '$3',
  $spacing4: '$4',
  $spacing5: '$5',
  $spacing6: '$6',
  $spacing7: '$8',
  $spacing8: '$10',
  $spacing9: '$12',
  $spacing10: '$13.5',
  $spacing11: '$20',
  $black: 'black',
  $white: 'white',
  $error: 'errorRed',
  $disabledText: 'blackOpacity.50',
  $disabledTextReversed: 'whiteOpacity.50',
  $blackOpacity70: 'blackOpacity.70',
  $blackOpacity30: 'blackOpacity.30',
  $blackOpacity10: 'blackOpacity.10',
  $blackOpacity4: 'blackOpacity.5',
  $whiteOpacity30: 'whiteOpacity.30',
  $whiteOpacity10: 'whiteOpacity.10',
  $whiteOpacity4: 'whiteOpacity.5',
};

const boxToTextProperties = [
  'bold',
  'color',
  'font',
  'font',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'fontFamily',
  'highlight',
  'isTruncated',
  'italic',
  'lineHeight',
  'lineSpacing',
  'noOfLines',
  'strickThrough',
  'sub',
  'textAlign',
  'textTransform',
  'underline',
  'variant',
];

export const isATextProp = p => _.includes(p, boxToTextProperties);

export const brandFontMap = {
  hero: 'hero',
  headerOne: 'headerOne',
  headerTwo: 'headerTwo',
  headerThree: 'headerThree',
  headerFour: 'headerFour',
  copyOne: 'copyOne',
  copyTwo: 'copyTwo',
  formUtility: 'formUtility',
};

const styleFontFamilyMap = {
  base: 'heading',
  body: 'body',
  alternative: 'alternative',
  brand: 'heading',
};

// Remove
// ------

// Must match both property and value
const removePropertyValuePairs = [
  { property: /^position/, value: /^relative/ },
  { property: /^flexDirection/, value: /^column/ },
  { property: /^flex-direction/, value: /^column/ },
  { property: /^display/, value: /^flex/ },
  { property: /^overflow$/, value: /^(?!.*(hidden|none)).*/ },
];

// Props only
const removeProperties = [
  /^animation/,
  /^appearance/,
  /^transition/,
  /^text-shadow$/,
  /^textShadow$/,
  /^text-shadow-offset$/,
  /^textShadowOffset$/,
  /^fontStretch$/,
  /^font-stretch$/,
  /^textOverflow$/,
  /^text-overflow$/,
  /^whiteSpace/,
  /^white-space/,
];

// Supported
// -----------

const supportedPropertyValuePairs = [
  // anything but flex or none is not supported
  { property: /^display/, value: /(^none|^flex)/ },
  { property: /^overflow$/, value: /(^hidden)/ },
  { property: /^position/, value: /(^absolute|^relative)/ },
];

const supportedProperties = [
  /^alignContent/,
  /^alignItems/,
  /^alignSelf/,
  /^background/,
  /^backgroundColor/,
  /^border/,
  /^bottom/,
  /^color/,
  /^cursor/,
  /^flex/,
  /^flexDirection/,
  /^font/,
  /^fontFamily/,
  /^fontSize/,
  /^height/,
  /^isTruncated/,
  /^justifyContent$/,
  /^left/,
  /^lineHeight/,
  /^margin/,
  /^maxHeight/,
  /^maxWidth/,
  /^minHeight/,
  /^minWidth/,
  /^padding/,
  /^right/,
  /^textAlign$/,
  /^textTransform/,
  /^thickness/, // TODO: We shouldn't need to include this here since it's in `skipableProperties`?
  /^top/,
  /^underline/,
  /^width/,
  /^zIndex/,
];

const unsupportedValue = [/^calc/, /^max/, /^min/, /^relative$/, /^!important/];

// Skipable
// Properties that we are handling in pre-processing
// We don't need the to be processed by css-to-react-native
// -----------
const skipablePropertyValuePairs = [];
const skipableProperties = [/^isTruncated$/, /^thickness$/];
const skipableValue = [];

const _isInReg = (test, regex) => _.some(re => re.test(test), regex);

export const _isRemovable = (property: string, value: string) => {
  // Remove by property and value matches
  const found = _.some(({ property: _p, value: _v }) => _p.test(property) && _v.test(value))(
    removePropertyValuePairs
  );

  if (found) {
    return true;
  }

  // Remove by property
  if (_isInReg(property, removeProperties)) {
    return true;
  }
  // Remove by value
  if (_isInReg(property, removeProperties)) {
    return true;
  }

  return false;
};

export const _isSupported = (property: string, value: string) => {
  // Unsupported by property and value matches
  const found = _.some(({ property: _p, value: _v }) => _p.test(property) && _v.test(value))(
    supportedPropertyValuePairs
  );
  if (found) {
    return true;
  }

  if (_hasUnsupportedCssUnits(value)) {
    return false;
  }

  // Unsupported by value
  if (_isInReg(value, unsupportedValue)) {
    return false;
  }

  // supported by property
  if (_isInReg(property, supportedProperties)) {
    return true;
  }

  return false;
};

export const _isSkipable = (property: string, value: string) => {
  // skipable by property and value matches
  const found = _.some(({ property: _p, value: _v }) => _p.test(property) && _v.test(value))(
    skipablePropertyValuePairs
  );

  if (found) {
    return true;
  }
  // skipable by property
  if (_isInReg(property, skipableProperties)) {
    return true;
  }
  // skipable by value
  if (_isInReg(value, skipableValue)) {
    return true;
  }
  return false;
};

// Css Processing order
// -------------------

// 1. Select a mapping based on the element or import e.g. `div` -> `Box`
// 2. PostCSS - turns the CSS string into CSS Object
// 3. Pre css-to-react-native
//   a. Check for mapping based on the object properties search for a better mapping.
//   b. if new mapping  add/remove properties.
//   c. if mapping changed re-run the pre process
// 4. css-to-react-native property conversion
// 5. Cleanup - convert (NB props) e.g. fontFamily: ‘$4’
// 6. Convert to AST
// 7. Convert expressions
//   a. steps 3-6..
export const checkForBetterMappingBasedOnProperties = (
  currentMapping: IElementMapping,
  obj: object
): {
  newObject: object;
  newMapping: IElementMapping;
} => {
  let newObject = obj;
  let to = currentMapping.to;
  let from = currentMapping.from;

  // Based on properties
  _.flow(
    _.entries,
    _.forEach(([key, value]) => {
      switch (key) {
        case 'whiteSpace':
        case 'textOverflow':
          newObject = _.assign(newObject, {
            isTruncated: true,
          });
          break;

        default:
          break;
      }
    })
  )(newObject);

  const newMapping = getElementMapping(from, to);
  return { newObject, newMapping };
};

const lineHeightArray = [
  // note: ignoring anything smaller then 1.0
  { key: 1, value: '2xs' },
  { key: 1.125, value: 'xs' },
  { key: 1.25, value: 'sm' },
  { key: 1.375, value: 'md' },
  { key: 1.5, value: 'lg' },
  { key: 1.75, value: 'xl' },
  { key: 2.0, value: '2xl' },
  { key: 2.5, value: '3xl' },
  { key: 3.0, value: '4xl' },
  { key: 4.0, value: '5xl' },
  // note: ignoring anything larger then 4.0
  { key: 10000, value: '5xl' },
];

const _hasUnsupportedCssUnits = value => {
  return /\d+(em|vh|vw)/.test(value) || /substitution__(em|vh|vw)/.test(value);
};

export const parseValueToPx = value => {
  if (String(value).match(subRegEx)) {
    throw Error('cant parse ' + value);
  }
  let v = value;
  const p = String(value).match(numberOrLengthRe);
  if (p && p[1]) {
    // Convert rem to pixel
    if (p[2] === 'rem') {
      const asNum = parseFloat(String(p[1]));
      if (!isNaN(asNum)) {
        v = Math.floor(asNum * 16);
      }
    } else {
      v = parseFloat(p[1]);
    }
  }
  return v;
};

const identifierMapping = {
  lineHeight: (currentValue: string, obj: object) => {
    let newValue = currentValue;
    let valueAsRem;

    // if it's a float assume it's something like `line-height: 1.3`
    if (_.isNumber(currentValue)) {
      // options
      valueAsRem = currentValue;
    }

    const p = String(currentValue).match(numberOrLengthRe);
    if (!valueAsRem && p && p[1]) {
      if (p[2] === 'rem') {
        valueAsRem = parseFloat(String(p[1]));
      }
      if (p[2] === '%') {
        valueAsRem = Number(p[1]) / 100;
      }
      if (p[2] === 'px') {
        // we need to convert to a percentage
        // If we have the font size we can use it otherwise just return
        // the 'md' value
        try {
          // @ts-ignore
          let fontSizeAsPx = parseValueToPx(obj.fontSize);
          const denominator = Number(p[1]);
          // Hack because people are setting line height to `1px`??
          if (!fontSizeAsPx || denominator === 1) {
            valueAsRem = 1.375;
          } else {
            valueAsRem = fontSizeAsPx / denominator;
          }
        } catch (error) {
          console.log(`fontSize error: `, error);
          valueAsRem = 1.375;
        }
      }
    }

    const res = _.find((l: { key: string; value: string }) => valueAsRem <= l.key)(lineHeightArray);

    if (res) {
      newValue = res.value;
    }
    return {
      newValue,
      isSkipable: true,
      isRemovable: false,
      isSupported: true,
    };
  },
  textDecoration: (currentValue: string, obj: object) => {
    return {
      newValue: currentValue,
      isSkipable: true,
      isRemovable: false,
      isSupported: true,
    };
  },
  width: (currentValue: string) => {
    let newValue = currentValue === '100%' ? 'full' : currentValue;
    return {
      newValue,
      isSupported: _isSupported('width', newValue),
      isRemovable: _isRemovable('width', newValue),
      isSkipable: _isSkipable('width', newValue),
    };
  },
};

// One-offs Pre toRN
// -------
export const preToRNTransform = (identifier, value, obj) => {
  let i = identifier;
  let v = value;
  let isSupported = _isSupported(identifier, value);
  let isRemovable = _isRemovable(identifier, value);
  let isSkipable = _isSkipable(identifier, value);

  // Mappings
  // --------
  const found = identifierMapping[identifier];
  if (found) {
    const {
      newValue,
      isSkipable: _skip,
      isRemovable: _remove,
      isSupported: _supported,
    } = found(v, obj);
    v = newValue;
    isSkipable = _skip;
    isRemovable = _remove;
    isSupported = _supported;
  }

  // if (identifier === 'boxShadow') {
  //   i = 'boxShadow';
  //   v = 'default';
  //   isSkipable = true;
  //   isSupported = true;
  // }
  if (identifier === 'margin' && _.includes('auto', value)) {
    i = 'align-self';
    v = 'center';
  }
  if (identifier === 'textDecoration') {
    i = 'underline';
    v = value === 'none' ? false : true;
    isSkipable = true;
  }

  // Skip font because we are converting to a variant
  if (identifier === 'font') {
    isSkipable = true;
  }

  // Supported
  // ---------

  // Objects are not supported
  if (_.isObject(value)) {
    isSupported = false;
  }

  if (identifier === 'position' && value === 'fixed') {
    isSupported = false;
  }

  return {
    identifier: i,
    value: v,
    isSupported,
    isRemovable,
    isSkipable,
  };
};

// One-offs Post toRN
// -------
export const postToRNTransform = (identifier, value) => {
  let i = identifier;
  let v = value;
  let isSupported = _isSupported(identifier, value);
  let isRemovable = _isRemovable(identifier, value);

  if (identifier === 'font') {
    // The correct variant is set in utils/parseExpression
    i = 'variant';
  }

  // Objects are not supported
  if (_.isObject(value)) {
    isSupported = false;
  }

  return {
    identifier: i,
    value: v,
    isSupported,
    isRemovable,
  };
};

export const valueToType = (j: JSCodeshift, value) => {
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
};

export interface IElementMapping {
  from: string;
  to: string;
  insertComments?: string | boolean;
  attributes?: {
    name: string;
    value?: number | string | boolean;
    comment?: string;
  }[];
  customImport?: {
    path: string;
    isDefault?: boolean;
    specifier?: string;
  };
  customPreProcessing?: (obj: object) => object;
  customPostProcessing?: (obj: object) => object;
}

const ActionButtonImport = {
  path: 'components/action-button',
  isDefault: true,
  specifier: 'ActionButton',
};

const LinkImport = {
  path: 'components/link',
  isDefault: true,
  specifier: 'Link',
};

const BoxPostProcessing = obj => {
  let hasText = false;
  Object.keys(obj).map(k => {
    if (!isATextProp(k)) {
      return;
    }
    const v = obj[k];
    hasText = true;
    // Move
    obj._text = obj._text = {};
    obj._text[k] = v;
    // remove the property
    delete obj[k];
  });
  return obj;
};

const DividerPostProcessing = obj => {
  const res = _.pickBy((_value, key) => {
    const shouldKeep = _isInReg(key, [/^width/, /^padding/, /^margin/]);
    return shouldKeep;
  })(obj);

  // @ts-ignore
  res.thickness = '1';
  return res;
};

export const elementArray: Array<IElementMapping> = [
  {
    from: 'div',
    to: 'Box',
    customPostProcessing: BoxPostProcessing,
  },
  {
    from: 'span',
    to: 'Box',
  },
  {
    insertComments: 'This was a <ul> tag. Verify its styled properly',
    from: 'ul',
    to: 'Box',
  },
  {
    insertComments: 'This was a <li> tag. Verify its styled properly',
    from: 'li',
    to: 'Box',
  },
  {
    from: 'hr',
    to: 'Divider',
    customPostProcessing: DividerPostProcessing,
  },
  {
    from: 'h1',
    to: 'Header',
    attributes: [
      { name: 'accessibilityLevel', value: 1 },
      { name: 'variant', value: 'headerOne' },
    ],
  },
  {
    from: 'h2',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerTwo' }],
  },
  {
    from: 'h3',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerThree' }],
  },
  {
    from: 'h4',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerFour' }],
  },
  {
    from: 'h5',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerFive' }],
  },
  {
    from: 'h6',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerFive' }],
  },
  {
    from: 'b',
    to: 'Text',
    attributes: [{ name: 'fontWeight', value: 'bold' }],
  },
  {
    from: 'p',
    to: 'Text',
  },
  {
    from: 'i',
    to: 'Text',
    attributes: [{ name: 'italic', value: true }],
  },
  {
    // TODO: Any attributes?
    from: 'strong',
    to: 'Text',
  },
  {
    from: 'section',
    to: 'Box',
    attributes: [
      {
        name: 'accessibilityRole',
        value: 'section',
        comment: '@ts-ignore web only attribute',
      },
    ],
  },
  {
    from: 'header',
    to: 'Box',
    attributes: [{ name: 'accessibilityRole', value: 'header' }],
  },
  {
    from: 'nav',
    to: 'Box',
    attributes: [
      {
        name: 'accessibilityRole',
        value: 'header',
        comment: '@ts-ignore web only attribute',
      },
    ],
    insertComments: 'This was a <nav> tag. Verify its styled properly',
  },
  {
    from: 'button',
    to: 'Button',
    // customImport: ActionButtonImport,
    // TODO post processing
    // customPostProcessing: (obj) => obj,
  },
  {
    from: 'a',
    to: 'Link',
    customImport: LinkImport,
    // TODO change:
    // - `href` to `to`
    // - nest text
    // customPostProcessing: (obj) => obj,
  },
  {
    from: 'fieldset',
    to: 'FormControl',
    insertComments: 'This was a <input> tag. Verify its styled properly',
  },
  {
    from: 'input',
    to: 'Input',
    insertComments: 'This was a <input> tag. Verify its styled properly',
  },
  {
    from: 'label',
    to: 'Text',
    insertComments: 'This was a <label> tag. This should be converted to a UL <FormControl.Label>',
  },
  {
    from: 'legend',
    to: 'Box',
    insertComments: 'This was a <legend> tag. Verify its styled properly',
  },
  {
    from: 'svg',
    to: 'Svg',
    insertComments: 'This was a <svg> tag. Verify its styled properly',
  },
  {
    from: 'css',
    to: 'noop',
  },
];

export const getElementMapping = (from: string, to?: string) => {
  // `noop` are special case
  // just return the values
  if (from === 'noop' || to === 'noop') {
    return { from, to };
  }

  const found = elementArray.find(e => {
    const fromMatch = e.from === from;
    const hasTo = to !== undefined;
    if (hasTo) {
      return fromMatch && e.to === to;
    }
    return fromMatch;
  });

  if (!found) {
    throw new Error(`Mapping not found. from: ${from} to: ${to}`);
  }
  return found;
};
