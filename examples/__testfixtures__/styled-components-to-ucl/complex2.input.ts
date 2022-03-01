import styled from 'styled-components';

import { IWithOrder } from './types';

export const CartItemEditContainer = styled.div<IWithOrder>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem;
  border-top: 1px solid ${Styles.color.grey.four};
  color: ${Styles.color.grey.one};

  button {
    background-color: ${Styles.color.cardBackground};
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;

    &[disabled] {
      color: ${Styles.color.grey.four};
      cursor: not-allowed;
    }
  }
`;
