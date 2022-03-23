import styled from 'styled-components';
import { primitive } from 'styles/constants/primitives';

export const CartItemEditContainer = styled.div<{ color: string }>`
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

export const Box = styled.div`
  width: 40;
  height: 4rem;
  padding: 12px 4px 12px 1px;
  margin: ${primitive.$spacing2} 0;
`;
