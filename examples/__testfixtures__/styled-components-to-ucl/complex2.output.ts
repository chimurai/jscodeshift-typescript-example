import { Box } from '@rbilabs/universal-components';

export const CartItemEditContainer = Box.withConfig<{
  color: string
}>(p => ({
  color: p.color
}))/*
TODO RN: unsupported CSS
Some attributes couldn't be converted
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
