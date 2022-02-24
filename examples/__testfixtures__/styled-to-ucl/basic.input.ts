import styled, { css } from 'styled-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const SpreadContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  color: ${props => props.color};
  background-color: ${p => p.backgroundColor};
`;

export const Another = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${Styles.color.black};
  text-align: left;
`;
