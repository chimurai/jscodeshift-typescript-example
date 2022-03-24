import { Box, FormControl, Header, makeUclComponent } from '@rbilabs/universal-components';

import { ClickableContainer } from 'components/clickable-container';
import { brandFont } from 'components/layout/brand-font';
import { LinkButton } from 'components/link-button';
import { primitive } from 'styles/constants/primitives';
import { filterProps } from 'utils/filter-props';
import { screenReaderOnly } from 'utils/style/screen-reader-only';

import { RewardsStyleVariant, WithStyleVariant } from '../types';

import { CategoryDropdownProps, OptionsContainerProps } from './types';

export const CategoryTitle = Header.withConfig<WithStyleVariant>(p => ({
  flexDirection: 'row',
  height: '$12',
  flexWrap: 'wrap',
  margin: 0,
  alignItems: 'center',

  color: p.variant
    ? '__legacyToken.text-reversed'
    : '__legacyToken.text-default',

  fontWeight: p.variant ? Styles.fontWeight.normal : 'inherit',
  variant: 'headerFive',

  fontSize: {
    lg: 19,
  },
}));

export const noBottomBorder = {
  borderWidth: 0,
  borderColor: 'black',
  borderStyle: 'solid',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
};

export const CategoryContainer = Box.withConfig<WithStyleVariant>(p => ({
  paddingX: '$4',
  paddingY: 0,
  borderTopWidth: 1,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderStyle: 'solid',

  borderTopColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.border-color-default',

  borderRightColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.border-color-default',

  borderBottomColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.border-color-default',

  borderLeftColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.border-color-default',

  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottomRightRadius: 8,
  borderBottomLeftRadius: 8,

  backgroundColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.background-pattern',

  // TODO: RN - unsupported CSS
  // boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
}));

export const Fieldset = FormControl.withConfig({
  borderWidth: 0,
  borderColor: 'black',
  borderStyle: 'solid',
  borderTopWidth: 1,
  borderTopColor: '__legacyToken.border-color-default',
  borderTopStyle: 'solid',
  margin: 0,
  padding: 0,
  width: '100%',
})/* TODO: RN - This was a <input> tag. Verify its styled properly*/;

export const HiddenLegend = Box.withConfig({
  ...screenReaderOnly,
})/* TODO: RN - This was a <legend> tag. Verify its styled properly*/;

export const CategoryDropdownContainer = CategoryContainer.withConfig<Pick<CategoryDropdownProps, 'optionsVisible' | 'overlay'>>({
  width: '100%',
  padding: 0,
  // ${({ optionsVisible, overlay }) => overlay && optionsVisible && noBottomBorder};
});

export const TitleContainer = Box.withConfig({
  paddingTop: '$2',
  paddingRight: '$4',
  paddingBottom: 0,
  paddingLeft: '$4',
  width: '100%',
});

export const Title = makeUclComponent(ClickableContainer).withConfig<{ isUsingTabNavigation: boolean; showBorder: boolean; bold: boolean } & WithStyleVariant>(p => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: p.showBorder ? '1px' : '0px',
  borderBottomStyle: 'solid',

  // This should be commented out i think and kept
  borderBottomColor: p.variant
    ? 'blackOpacity.30'
    : '__legacyToken.border-color-default',

  width: '100%',
  paddingBottom: '$2',
}))/*
TODO: RN - unsupported CSS
Some attributes were not converted.

export const Title = styled(ClickableContainer)<
  { isUsingTabNavigation: boolean; showBorder: boolean; bold: boolean } & WithStyleVariant
>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: ${({ bold }) => bold && Styles.fontWeight.heavy};
  border-bottom: ${({ showBorder }) => (showBorder ? '1px' : '0px')};
  border-bottom-style: solid;
  border-bottom-color: ${({ variant, theme }) =>
    variant === RewardsStyleVariant.Secondary
      ? primitive.$blackOpacity30
      : theme.token('border-color-default')};

  &:focus {
    ${({ isUsingTabNavigation }) => !isUsingTabNavigation && 'outline: none;'};
  }

  width: 100%;
  padding-bottom: ${primitive.$spacing2};

  & > {
    height: 3rem;
  }
`;

*/;

export const overlayStyle = p => ({
  position: 'absolute',

  // TODO: RN - unsupported CSS
  // width: 'calc(100% + 2px)',

  left: -1,

  backgroundColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.background-pattern',

  zIndex: Styles.zIndex.below,
  borderTopWidth: 1,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderStyle: 'solid',

  borderTopColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.border-color-default',

  borderRightColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.border-color-default',

  borderBottomColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.border-color-default',

  borderLeftColor: p.variant
    ? primitive.th.$alwaysRedDarken10
    : '__legacyToken.border-color-default',

  borderWidth: 0,
  borderColor: 'black',
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
});

export const OptionsContainer = Box.withConfig<OptionsContainerProps>({
  paddingX: '$4',
  paddingY: 0,
  zIndex: Styles.zIndex.normal,
});

export const SeeMoreOptionsCTA = // TODO: RN - This styled component could not be codemoded. Check manual-work/*.md for guidance
() => null;