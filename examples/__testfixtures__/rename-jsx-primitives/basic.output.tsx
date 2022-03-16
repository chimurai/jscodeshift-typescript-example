import { Box, Divider, Header, Text } from '@rbilabs/universal-components';

<Box />

function Div() {
  return <Box data-testid="foo">Hi</Box>;
}

function Span() {
  return <Box>Hi</Box>;
}

function HR() {
  return <Divider>Hi</Divider>;
}

function H1() {
  return <Header accessibilityLevel={1} variant='headerOne'>Hi</Header>;
}

function H2() {
  return <Header variant='headerTwo'>Hi</Header>;
}

function H3() {
  return <Header variant='headerThree'>Hi</Header>;
}

function H4() {
  return <Header variant='headerFour'>Hi</Header>;
}

function H5() {
  return <Header variant='headerFive'>Hi</Header>;
}

function InlineBR() {
  return <Box>{'\n'}</Box>;
}

function OutsideJSXBr() {
  const br = '\n'
  return <Box>{br}</Box>;
}

function B() {
  return <Text fontWeight='bold'>hi</Text>;
}

function P() {
  return <Text>hi</Text>;
}

function Strong() {
  return <Text>hi</Text>;
}

function I() {
  return <Text italic>hi</Text>;
}

function ULLI() {
  return (
    // Hello
    // TODO: RN - This was a <ul> tag. Verify its styled properly
    (<Box>
      {/*TODO: RN - This was a <li> tag. Verify its styled properly*/
      }<Box hidden>hi</Box>
      {/*TODO: RN - This was a <li> tag. Verify its styled properly*/
      }<Box>hi</Box>
    </Box>)
  );
}