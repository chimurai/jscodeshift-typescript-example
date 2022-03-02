import * as React from "react";
import {
  useMatch,
  useParams,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

export function Foo() {
  const match = useMatch();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  return <Link onClick={() => navigate("/bar")}>Go to Bar</Link>;
}
