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

export const Heading = styled.h1`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
`;

const textStyles = css`
  margin: 0;
  text-transform: ${Styles.textTransform.headlines};
  font: ${brandFont.headerThree};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  ${Styles.desktop`
    letter-spacing: 1px;
  `}
`;
