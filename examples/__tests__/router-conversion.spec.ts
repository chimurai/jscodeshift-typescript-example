import { defineTest } from "jscodeshift/src/testUtils";

describe("router conversion", () => {
  defineTest(
    __dirname,
    "./router-conversion",
    null,
    "router-conversion/members",
    {
      parser: "tsx",
    },
  );
  defineTest(
    __dirname,
    "./router-conversion",
    null,
    "router-conversion/basic",
    {
      parser: "tsx",
    },
  );
  defineTest(
    __dirname,
    "./router-conversion",
    null,
    "router-conversion/missing-location-import",
    {
      parser: "tsx",
    },
  );
  defineTest(
    __dirname,
    "./router-conversion",
    null,
    "router-conversion/renamed-link",
    {
      parser: "tsx",
    },
  );
});
