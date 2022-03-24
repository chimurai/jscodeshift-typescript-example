import { Box, Button, Header, makeUclComponent, Text } from '@rbilabs/universal-components';

import { Container as EmptyStateContainer } from 'components/empty-state';
import { brandFont } from 'components/layout/brand-font';
import Link from 'components/link';
import { primitive } from 'styles/constants/primitives';

export const ScrollContainer = Box.withConfig({
  // TODO: RN - unsupported CSS
  // height: 'calc(100% - 164px)',

  paddingTop: '124px',

  // TODO: RN - unsupported CSS
  // overflowY: 'auto',
});

export const TrackOrderLink = makeUclComponent(Link).withConfig({
  borderWidth: 1,
  borderColor: '__legacyToken.border-color-button-secondary',
  borderStyle: 'solid',
  borderTopLeftRadius: 32,
  borderTopRightRadius: 32,
  borderBottomRightRadius: 32,
  borderBottomLeftRadius: 32,
  marginX: 0,
  marginY: '$1',
  paddingTop: '$1',
  paddingRight: '$3',
  paddingBottom: '$1',
  paddingLeft: '$3',
  fontSize: '0.7em',
  color: '__legacyToken.text-button-secondary',
  fontWeight: '500',
  underline: false,
  textTransform: 'uppercase',

  _hover: {
    backgroundColor: '__legacyToken.background-button-primary-default',
    color: '__legacyToken.text-link-reversed',
  },

  position: {
    lg: 'absolute',
  },

  right: {
    lg: '$8',
  },

  top: {
    lg: '$6',
  },
});

export const Tile = Box.withConfig({
  backgroundColor: '__legacyToken.background-pattern',

  // TODO: RN - unsupported CSS
  // boxShadow: '__1substitution__',

  borderTopLeftRadius: Styles.borderRadius,
  borderTopRightRadius: Styles.borderRadius,
  borderBottomRightRadius: Styles.borderRadius,
  borderBottomLeftRadius: Styles.borderRadius,
  alignItems: 'center',

  minHeight: {
    lg: 174,
  },

  paddingX: {
    base: '$4',
    lg: '$13.5',
  },

  paddingY: {
    base: '$3',
    lg: '$8',
  },

  justifyContent: {
    lg: 'space-between',
  },

  flexDirection: {
    lg: 'row',
  },
})/*
TODO: RN - unsupported CSS
Some attributes were not converted.

export const Tile = styled.div`
  background: ${p => p.theme.token('background-pattern')};
  box-shadow: ${Styles.boxShadow};
  border-radius: ${Styles.borderRadius};
  padding: ${primitive.$spacing3} ${primitive.$spacing4};
  display: flex;
  flex-direction: column;
  align-items: center;

  :nth-of-type(n + 1) {
    margin-top: ${primitive.$spacing4};
  }

  ${Styles.desktop`
    min-height: 174px;
    padding: ${primitive.$spacing7} ${primitive.$spacing10};
    justify-content: space-between;
    flex-direction: row;
  `}
`;

*/;

export const Col = Box.withConfig({
  width: {
    base: '100%',
    lg: '48%',
  },

  marginBottom: {
    lg: 0,
  },
})/*
TODO: RN - unsupported CSS
Some attributes were not converted.

export const Col = styled.div`
  width: 100%;

  :nth-of-type(2n + 1) {
    margin-bottom: ${primitive.$spacing6};
  }

  ${Styles.desktop`
    width: 48%;
    margin-bottom: 0;

    :nth-of-type(2n + 1) {
      margin-bottom: 0;
    }

    :nth-of-type(n + 2) {
      margin-left: 2%;
    }
  `}
`;

*/;

export const ButtonCol = Col.withConfig({});

export const MoreItems = Button.withConfig({
  _text: {
    color: '__legacyToken.text-button-secondary',
    variant: 'copyOne',
  },

  backgroundColor: 'none',
  borderWidth: 0,
  borderColor: 'black',
  borderStyle: 'solid',
  padding: 0,
  cursor: 'pointer',

  _hover: {
    underline: true,
  },
});
export const FormattedDate = Box.withConfig({
  _text: {
    variant: 'headerTwo',
    textTransform: Styles.textTransform.headlines,
  },

  marginBottom: '$1',
});

export const SubtitleContainer = Text.withConfig({
  // TODO: RN - unsupported CSS
  // display: 'inline-flex',

  fontWeight: 'bold',
  alignItems: 'center',
  color: '__legacyToken.text-default',
});

export const CateringPendingApproval = Text.withConfig({
  variant: 'copyTwo',
  color: 'errorRed',
  margin: 0,
});

export const NumItems = Box.withConfig({
  marginLeft: '$1',
});

export const Items = Text.withConfig({
  lineHeight: 'lg',
  maxHeight: 48,
  paddingRight: '$4',
  overflow: 'hidden',
  margin: 0,
});

export const ItemNameContainer = Box.withConfig({
  flexDirection: 'row',
  alignItems: 'center',
})/*
TODO: RN - unsupported CSS
Some attributes were not converted.

export const ItemNameContainer = styled.div`
  display: flex;
  align-items: center;

  p {
    color: ${p => p.theme.token('text-default')};
  }
`;

*/;

export const Wrap = Box.withConfig({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',

  height: {
    lg: 'auto',
  },
})/*
TODO: RN - unsupported CSS
Some attributes were not converted.

export const Wrap = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;

  ${Styles.desktop`
    height: auto;

    ${EmptyStateContainer}{
      max-width: 800px;
    }
  `}
`;

*/;

export const RecentOrderTitle = Header.withConfig({
  marginX: 0,
  marginY: '$8',
  marginBottom: '$5',
  // TODO: This should not be like this
  color: '__2substitution__ !important',
  textAlign: 'center',
  variant: 'headerTwo',

  fontSize: {
    base: 36,
    lg: 56,
  },
});

export const OrderNumber = Text.withConfig({
  variant: 'headerThree',
  color: '__legacyToken.text-accent-order-number',
  margin: 0,
});

export const OrderNumberWrapper = Box.withConfig({
  flexDirection: 'row',
  marginX: 0,
  marginY: '$4',
});

export const OrderNumberText = Text.withConfig({
  variant: 'headerThree',
  textTransform: 'capitalize',
  marginTop: 0,
  marginRight: '$1',
  marginBottom: 0,
  marginLeft: 0,
});