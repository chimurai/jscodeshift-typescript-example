const fs = require('fs');
const { execSync } = require("child_process");

const rawdata = fs.readFileSync('/Users/rbikf004/dev/rbilabs/ctg-whitelabel-app/workspaces/frontend/rn-mocked-files.json');
const parsed = JSON.parse(rawdata);
let count = 0;

parsed.forEach(f => {
  if (count > 30) {
    return;
  }
  try {
    const cmd = `npx jscodeshift --fail-on-error -t ./examples/styled-components-to-ucl/index.ts --extensions=ts --parser=ts /Users/rbikf004/dev/rbilabs/ctg-whitelabel-app/workspaces/frontend/src/${f}`;
    // const res = execSync(cmd, { stdio: 'ignore' });
    const res = execSync(cmd);
    console.log(`res: `, res);
    console.log(`file processed `, f);
    count++
  } catch (error) {
    console.log(`error: ${error.message}`, f);
    return;
  }
})
