import { Box as UCLBox } from '@rbilabs/universal-components';
import { ThemeProvider, css, keyframes } from 'styled-components';

export const c = css`
  padding: ${primitive.$spacing1} ${primitive.$spacing2};
`;

export const Box = UCLBox.withConfig({
  width: '$10',
});

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
