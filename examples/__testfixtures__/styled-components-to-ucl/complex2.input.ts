import styled from 'styled-components';

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
