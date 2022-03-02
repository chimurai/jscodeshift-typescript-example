const fs = require('fs');
const { execSync } = require("child_process");

const rawdata = fs.readFileSync('/Users/rbikf004/dev/rbilabs/ctg-whitelabel-app/workspaces/frontend/rn-mocked-files.json');
const parsed = JSON.parse(rawdata);
let count = 0;

const unconverted = [];

parsed.forEach(f => {
  // if (count > 10) {
  //   return;
  // }
  try {
    const cmd = `npx jscodeshift -t ./examples/styled-components-to-ucl/index.ts --extensions=ts --parser=ts /Users/rbikf004/dev/rbilabs/ctg-whitelabel-app/workspaces/frontend/src/${f}`;
    const res = execSync(cmd, { stdio: 'inherit' });
    // const res = execSync(cmd);
    if (res && res.includes('ERR_NO_STYLED_COMPONENT_IMPORT')) {
      console.log(`ERR_NO_STYLED_COMPONENT_IMPORT: in `, res);
      console.log(`file processed `, f);
    }
  } catch (error) {
    console.log(`error: ${error.message}`, f);
    unconverted.push(f);
    return;
  }
  console.log(`count: `, count);
  count++
})

console.log(`unconverted: `, unconverted);
