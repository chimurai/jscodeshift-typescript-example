
import styled, { ThemeProvider, css, keyframes } from 'styled-components';

export const c = css`
  padding: ${primitive.$spacing1} ${primitive.$spacing2};
`;

export const Box = styled.div`
  width: 40;
`;

export const k = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0
  }
`

function App() {
  return (
    <ThemeProvider>
      <Box>
        Hello
      </Box>
    </ThemeProvider>
  );
}

export default AppRegistry.registerComponent('App', () => App);
