import { defineTest } from "jscodeshift/src/testUtils";

describe("data-testid to testID", () => {
  defineTest(__dirname, "../codemods/testid", null, "testid/basic", {
    parser: "tsx",
  });
  defineTest(__dirname, "../codemods/testid", null, "testid/arguments", {
    parser: "tsx",
  });
  defineTest(__dirname, "../codemods/testid", null, "testid/destructured", {
    parser: "tsx",
  });
  defineTest(__dirname, "../codemods/testid", null, "testid/types", {
    parser: "ts",
  });
});
