import * as fs from "fs";
import * as uuid from "uuid";

type Props = {
  filePath: string;
  helpfulMessage: string;
  startingLine: number;
  endingLine: number;
};

let logs: Props[] = [];

export function logManualWork(props: Props) {
  logs.push(props);
}

export function commitManualLogs(source) {
  fs.appendFileSync(
    "./manual-work.md",
    logs
      .map(
        (m) => `
# Manual Work ID: ${uuid.v4()}
-------------------------------------------------------
file: \`${m.filePath.replace(process.cwd(), "")}\`

### Information:
${m.helpfulMessage}

_Verify that the conversion is correct. L${m.startingLine}:L${m.endingLine}_

\`\`\`tsx
${printSource(source, m.startingLine, m.endingLine)}
\`\`\`
  `,
      )
      .join("\n"),
  );

  logs = [];
}

function printSource(source: string, start: number, end: number) {
  const lines = source.split("\n");

  // add 4 surrounding lines.
  const startingLine = start - 4 < 0 ? 0 : start - 4;
  const endingLine = end + 4;

  return lines
    .splice(startingLine, endingLine)
    .map((l, i) => `${i + startingLine + 1}`.padStart(2, " ") + `| ${l}`)
    .join("\n");
}
