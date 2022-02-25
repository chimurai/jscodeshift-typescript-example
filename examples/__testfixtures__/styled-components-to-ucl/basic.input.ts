import styled, { css } from 'styled-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const Basic = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  color: ${props => props.color};
  background-color: ${p => p.backgroundColor};
`;

export const Tokens = styled.div`
  color: ${p => p.theme.token('text-reversed')};
  background-color: ${props => props.theme.token('background-pattern')};
`;

export const SubHeader = styled.h1`
  color: ${p => p.theme.token('text-reversed')};
`;

export const Conditional = styled.div`
  color: ${p => (p.reversed ? p.theme.token('text-reversed') : p.theme.token('text-default'))};
  background-color: ${p => (p.reversed ? Styles.color.white : p.theme.token('text-default'))};
`;
