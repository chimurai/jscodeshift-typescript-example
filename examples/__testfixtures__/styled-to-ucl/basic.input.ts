import styled, { css } from 'styled-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const SpreadContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  color: ${Styles.color.black};
  background-color: ${props => props.backgroundColor};
`;

export const Another = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
`;
