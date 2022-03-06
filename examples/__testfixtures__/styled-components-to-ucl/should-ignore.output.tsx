import { Box as UCLBox } from '@rbilabs/universal-components';
import { ThemeProvider } from 'styled-components';

export const c = {
  paddingX: '$2',
  paddingY: '$1',
};

export const Box = UCLBox.withConfig({
  width: '$10',
});

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
