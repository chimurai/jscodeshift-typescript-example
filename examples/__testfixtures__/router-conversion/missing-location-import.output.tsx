import { useMatch, useLocationContext } from 'state/location';
import * as React from "react";
import Link, { LinkProps } from "components/link";

export function Foo(props: LinkProps) {
  const match = useMatch();
  const {
    navigate,
  } = useLocationContext();

  return <Link onClick={() => navigate("/bar")}>Go to Bar</Link>;
}
