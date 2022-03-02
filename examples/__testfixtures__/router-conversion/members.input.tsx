import * as React from "react";
import { useLocation } from "react-router-dom";
import { useLocationContext } from "state/location";

export function Foo() {
  const locationContext = useLocationContext();
  const currentUrl = useLocation().pathname;

  return <div />;
}
