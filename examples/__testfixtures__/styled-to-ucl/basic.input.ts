import styled, { css } from 'styled-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const SpreadContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
`;

export const Heading = styled.h2`
  font-size: 1.1rem;
  color: ${Styles.color.black};
  text-align: center;
`;

export const Another = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
`;
