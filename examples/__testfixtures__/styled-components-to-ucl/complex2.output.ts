import { Box as UCLBox } from '@rbilabs/universal-components';
import { primitive } from 'styles/constants/primitives';

export const CartItemEditContainer = UCLBox.withConfig<{
  color: string
}>(p => ({
  _text: {
    color: p.color,
  },
}))/*
TODO RN: unsupported CSS

Some attributes couldn't be converted
Please use git history to get the exact values

  color: !EXPRESSION!;
  button {
    background-color: !EXPRESSION!;
  }
  & > button {
    display: flex;
    color: !EXPRESSION!;

    svg {
      color: !EXPRESSION!;
    }
  }

*/;

export const Box = UCLBox.withConfig({
  width: '$10',
  height: '$16',
  paddingTop: '$3',
  paddingRight: '$1',
  paddingBottom: '$3',
  paddingLeft: '1px',
  marginX: '0',
  marginY: '$2',
});

