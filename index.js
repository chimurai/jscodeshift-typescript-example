console.log(`jscodeshift-to-react-native cannot be used on its own. Please use the following steps,

yarn add -D jscodeshift
yarn add kfinley-rbi/jscodeshift-typescript-example
jscodeshift -t jscodeshift-to-react-native/codemods/index.ts <path>
`);
