import { Box } from '@rbilabs/universal-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const SpreadContentContainer = 1;

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
