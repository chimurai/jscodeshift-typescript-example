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
Some attributes couldn't be converted.

export const CartItemEditContainer = styled.div`
  color: ${props => props.color};
  button {
    background-color: ${Styles.color.cardBackground};
  }
  & > button {
    display: flex;
    color: ${Styles.color.black};

    svg {
      color: ${Styles.color.black};
    }
  }
`;

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

