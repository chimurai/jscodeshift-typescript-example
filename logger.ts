import * as fs from "fs";
import * as uuid from "uuid";
import * as _ from "lodash";

type LogMeta = {
  filePath: string;
  helpfulMessage: string;
  startingLine: number;
  endingLine: number;
};

let logs: LogMeta[] = [];

export function logManualWork(props: LogMeta) {
  logs.push(props);
}

// remap an array of logs into a dictionary of {[filePath]: LogMeta[]}
// then print the logs to a file in a directory like `./manual-work/file-path.md`
export function commitManualLogs(source) {
  const fileLogs = logs.reduce((map, log) => {
    map[log.filePath] = map[log.filePath] || [];
    map[log.filePath].push(log);

    return map;
  }, {} as Record<string, LogMeta[]>);

  // make sure directory exists so we don't crash writing the file.
  try {
    fs.mkdirSync("./manual-work");
  } catch {}

  for (const filePath in fileLogs) {
    const filename = filePath.split("/").slice(-2).join("-");
    fs.appendFileSync(
      `./manual-work/${filename}.md`,
      fileLogs[filePath]
        .map(
          (m) => `# Manual Work ID: ${uuid.v4()}
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
  }

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
