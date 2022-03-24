import { Box } from '@rbilabs/components-library';

<Box />

function Div() {
  return <div data-testid="foo">Hi</div>;
}

function Span() {
  return <span>Hi</span>;
}

function HR() {
  return <hr>Hi</hr>;
}

function H1() {
  return <h1>Hi</h1>;
}

function H2() {
  return <h2>Hi</h2>;
}

function H3() {
  return <h3>Hi</h3>;
}

function H4() {
  return <h4>Hi</h4>;
}

function H5() {
  return <h5>Hi</h5>;
}

function InlineBR() {
  return <div><br /></div>;
}

function OutsideJSXBr() {
  const br = <br />
  return <div>{br}</div>
}

function B() {
  return <b>hi</b>
}

function P() {
  return <p>hi</p>
}

function Strong() {
  return <strong>hi</strong>
}

function I() {
  return <i>hi</i>
}

function ULLI() {
  return (
    // Hello
    <ul>
      <li hidden>hi</li>
      <li>hi</li>
    </ul>
  )
}

function SelfClosing() {
  return <input />
}