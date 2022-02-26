const fs = require('fs');
const { execSync } = require("child_process");

const rawdata = fs.readFileSync('/Users/rbikf004/dev/rbilabs/ctg-whitelabel-app/workspaces/frontend/rn-mocked-files.json');
const parsed = JSON.parse(rawdata);
let count = 0;

parsed.forEach(f => {
  if (count > 20) {
    return;
  }
  try {
    const res = execSync(`npx jscodeshift -t ./examples/styled-components-to-ucl/index.ts --extensions=ts --parser=ts /Users/rbikf004/dev/rbilabs/ctg-whitelabel-app/workspaces/frontend/src/${f} --print`);
    console.log(`res: ${res}`, f);
  } catch (error) {
    console.log(`error: ${error.message}`, f);
  }
})
