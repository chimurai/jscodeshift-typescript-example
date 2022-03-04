import { defineTest } from "jscodeshift/src/testUtils";

describe("renaming a variable", () => {
  defineTest(
    __dirname,
    "../codemods/rename-jsx-primitives",
    null,
    "rename-jsx-primitives/basic",
    { parser: "tsx" },
  );
});
