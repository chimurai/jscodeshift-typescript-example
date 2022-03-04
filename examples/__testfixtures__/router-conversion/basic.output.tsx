import Link from 'components/link';
import { useMatch, useParams, useLocationContext } from 'state/location';
import * as React from "react";

export function Foo() {
  const match = useMatch();
  const params = useParams();
  const {
    navigate,
  } = useLocationContext();
  const {
    location,
  } = useLocationContext();

  return <Link onClick={() => navigate("/bar")}>Go to Bar</Link>;
}
