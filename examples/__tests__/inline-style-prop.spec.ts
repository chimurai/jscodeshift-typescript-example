import { defineTest } from "jscodeshift/src/testUtils";

// TODO: Add a test that makes sure fontSize gets put into a _text key.
describe("renaming a variable", () => {
  defineTest(
    __dirname,
    "../codemods/inline-style-prop",
    null,
    "inline-style-prop/dont-crash-on-these",
    { parser: "tsx" },
  );
  defineTest(
    __dirname,
    "../codemods/inline-style-prop",
    null,
    "inline-style-prop/referenced-object",
    { parser: "tsx" },
  );
  defineTest(
    __dirname,
    "../codemods/inline-style-prop",
    null,
    "inline-style-prop/basic",
    { parser: "tsx" },
  );
  defineTest(
    __dirname,
    "../codemods/inline-style-prop",
    null,
    "inline-style-prop/flex-flip",
    { parser: "tsx" },
  );
  defineTest(
    __dirname,
    "../codemods/inline-style-prop",
    null,
    "inline-style-prop/styles-with-spread",
    { parser: "tsx" },
  );
});
