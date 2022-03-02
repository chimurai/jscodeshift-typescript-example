import styled, { css } from 'styled-components';
import Modal from './modal';

/**
 * Spreads children horizontally and centers them vertically
 */
export const Basic = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  color: ${props => props.color};
  background-color: ${p => p.backgroundColor};
  transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
  border-top: 1px solid ${Styles.color.primary};
`;

export const Tokens = styled.div`
  margin: 9px auto 0;
  color: ${p => p.theme.token('text-reversed')};
  background-color: ${props => props.theme.token('background-pattern')};
  border: 2px solid ${Styles.color.primary};
`;

export const SubHeader = styled.h1`
  color: ${p => p.theme.token('text-reversed')};
`;

export const Conditional = styled.div`
  color: ${p => (p.reversed ? p.theme.token('text-reversed') : p.theme.token('text-default'))};
  background-color: ${p => (p.reversed ? Styles.color.white : p.theme.token('text-default'))};
`;

export const ModalExtended = styled(Modal)`
  background-color: ${props => props.theme.token('background-pattern')};
`;
