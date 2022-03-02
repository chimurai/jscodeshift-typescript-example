import * as React from "react";
import { useMatch, useNavigate, Link } from "react-router-dom";
import { LinkProps } from "components/link";

export function Foo(props: LinkProps) {
  const match = useMatch();
  const navigate = useNavigate();

  return <Link onClick={() => navigate("/bar")}>Go to Bar</Link>;
}
