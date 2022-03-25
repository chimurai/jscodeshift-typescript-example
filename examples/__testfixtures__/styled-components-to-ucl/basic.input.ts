import styled from 'styled-components';
import Modal from './modal';

/**
 * Spreads children horizontally and centers them vertically
 */
export const Basic = styled.div<{
  color: string;
  backgroundColor: string
}>`
  display: flex;
  position: relative;
  margin: 0 auto;
  transform: rotate(180deg) translateX(50%);
  box-shadow: inset 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  align-items: center;
  text-align: left;
  color: ${props => props.color};
  background-color: ${p => p.backgroundColor};
  transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
  border-top: 1px solid ${Styles.color.primary};
  padding: 0 !important;
`;

export const Tokens = styled.header`
  display: block;
  margin: 9px auto 0;
  color: ${p => p.theme.token('text-reversed')};
  background-color: ${props => props.theme.token('background-pattern')};
  border: 2px solid ${Styles.color.primary};
  text-decoration: underline;
`;

export const Header = styled.h1`
  text-shadow: 10px 20px 30px red;
  color: ${p => p.theme.token('text-reversed')};
  text-decoration: none;
`;

export const Conditional = styled.div<{ reversed: boolean }>`
  color: ${p => (p.reversed ? p.theme.token('text-reversed') : p.theme.token('text-default'))};
  background-color: ${p => (p.reversed ? Styles.color.white : p.theme.token('text-default'))};
`;

export const ModalExtended = styled(Modal)`
  background-color: ${props => props.theme.token('background-pattern')};
`;

export const Units = styled.div`
  height: 1rem;
  width: 1px;
  padding-top: 1em;
  padding-bottom: 1vh;
  padding-left: 1vw;
  padding-right: 1%;
`
