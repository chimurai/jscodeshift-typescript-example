import * as postcss from "postcss";
import * as postcssJs from "postcss-js";
import transform from "css-to-react-native";


export const toJSSObject = (cssText) => {
  const root = postcss.parse(cssText);
  return postcssJs.objectify(root);
};

export const toJSS = (cssText) => {
  try {
    return JSON.stringify(toJSSObject(cssText), null, 2);
  } catch (e) {
    console.error(`toJSS error: `, e);
    return "Error translating CSS to JSS";
  }
};

export const toRN = (cssText) => {
  try {
    const output = toJSSObject(cssText);
    const result = Object.keys(output).map((rules) => [rules, output[rules]]);
    // @ts-ignore
    return JSON.stringify(transform(result), null, 2);
  } catch (e) {
    console.error(`toRn error: `, e);
    return "Error translating CSS to RN";
  }
};
