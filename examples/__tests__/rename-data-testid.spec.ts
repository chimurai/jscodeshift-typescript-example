import { defineTest } from "jscodeshift/src/testUtils";

describe("data-testid to testID", () => {
  // defineTest(__dirname, "./testid", null, "testid/basic", {
  //   parser: "tsx",
  // });
  // defineTest(__dirname, "./testid", null, "testid/arguments", {
  //   parser: "tsx",
  // });
  // defineTest(__dirname, "./testid", null, "testid/destructured", {
  //   parser: "tsx",
  // });
  defineTest(__dirname, "./testid", null, "testid/types", {
    parser: "ts",
  });
});
