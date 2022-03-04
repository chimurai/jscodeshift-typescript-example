import * as React from "react";
import { useLocationContext } from "state/location";

export function Foo() {
  const {
    location,
  } = useLocationContext();

  const locationContext = useLocationContext();
  const currentUrl = location.pathname;

  return <div />;
}
