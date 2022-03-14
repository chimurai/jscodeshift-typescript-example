import styled from 'styled-components';

export interface IMethodContainer {
  disableHover?: boolean;
  disableMethod?: boolean;
  hideBorder?: boolean;
  fromCheckout?: boolean;
  $isClickable?: boolean;
}

export const MethodTypeWrapper = styled.div<IMethodContainer>`
  align-items: center;
  padding: 0 8px 0 8px;
  display: flex;
  flex-grow: 2;
  height: inherit;
  text-align: left;
  color: ${p => p.theme.token('text-default')};
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'auto')};
  ${Styles.desktop`
    flex-grow: 3;
  `};

  span {
    margin-left: 8px;
    font-size: 13px;
    text-transform: capitalize;
  }

  ${({ disableMethod, fromCheckout }) =>
    disableMethod &&
    fromCheckout &&
    `
    pointer-events: none;
    border: 1px solid ${Styles.color.disabledBorder};
    border-radius: 8px;
    color: ${Styles.color.disabledColor};
  `}
`
