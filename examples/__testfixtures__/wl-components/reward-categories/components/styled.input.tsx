import styled, { css } from 'styled-components';

import { ClickableContainer } from 'components/clickable-container';
import { brandFont } from 'components/layout/brand-font';
import { LinkButton } from 'components/link-button';
import { primitive } from 'styles/constants/primitives';
import { filterProps } from 'utils/filter-props';
import { screenReaderOnly } from 'utils/style/screen-reader-only';

import { RewardsStyleVariant, WithStyleVariant } from '../types';

import { CategoryDropdownProps, OptionsContainerProps } from './types';

export const CategoryTitle = styled.h5<WithStyleVariant>`
  height: 3rem;
  flex-wrap: wrap;
  margin: 0rem;
  display: flex;
  align-items: center;
  color: ${({ variant, theme }) =>
    variant === RewardsStyleVariant.Secondary
      ? theme.token('text-reversed')
      : theme.token('text-default')};
  font-weight: ${({ variant }) =>
    variant === RewardsStyleVariant.Secondary ? Styles.fontWeight.normal : 'inherit'};
  ${Styles.desktop`
  font-size:1.2rem;
`}
`;

export const noBottomBorder = css`
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

export const CategoryContainer = styled.div<WithStyleVariant>`
  padding: 0 ${primitive.$spacing4};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ variant, theme }) =>
    variant === RewardsStyleVariant.Secondary
      ? primitive.th.$alwaysRedDarken10
      : theme.token('border-color-default')};
  border-radius: 0.5rem;
  background-color: ${({ variant, theme }) =>
    variant === RewardsStyleVariant.Secondary
      ? primitive.th.$alwaysRedDarken10
      : theme.token('background-pattern')};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
`;

export const Fieldset = styled.fieldset`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.token('border-color-default')};
  margin: 0;
  padding: 0;
  width: 100%;
`;

export const HiddenLegend = styled.legend`
  ${screenReaderOnly};
`;

export const CategoryDropdownContainer = styled(CategoryContainer)<
  Pick<CategoryDropdownProps, 'optionsVisible' | 'overlay'>
>`
  position: relative;
  width: 100%;
  padding: 0;
  ${({ optionsVisible, overlay }) => overlay && optionsVisible && noBottomBorder};
`;

export const TitleContainer = styled.div`
  padding: ${primitive.$spacing2} ${primitive.$spacing4} 0;
  width: 100%;
`;

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

export const overlayStyle = css<OptionsContainerProps>`
  position: absolute;
  width: calc(100% + 2px);
  left: -1px;
  background: ${({ variant, theme }) =>
    variant === RewardsStyleVariant.Secondary
      ? primitive.th.$alwaysRedDarken10
      : theme.token('background-pattern')};
  z-index: ${Styles.zIndex.below};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ variant, theme }) =>
    variant === RewardsStyleVariant.Secondary
      ? primitive.th.$alwaysRedDarken10
      : theme.token('border-color-default')};
  border-top: none;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
`;

export const OptionsContainer = styled.div<OptionsContainerProps>`
  ${({ overlay }) => overlay && overlayStyle}
  padding: 0 ${primitive.$spacing4};
  z-index: ${Styles.zIndex.normal};
  ${({ focusOptionsWhenNotVisible, optionsVisible }) =>
    !optionsVisible && (focusOptionsWhenNotVisible ? screenReaderOnly : 'display: none;')};
`;

export const SeeMoreOptionsCTA = styled(filterProps(LinkButton, 'variant'))<WithStyleVariant>`
  width: 100%;
  padding: ${primitive.$spacing6} 0 ${primitive.$spacing7};
  text-align: left;
  font: ${brandFont.copyOne};
  color: ${({ variant, theme }) =>
    variant === RewardsStyleVariant.Secondary
      ? theme.token('text-link-reversed')
      : theme.token('text-link-default')};
`;
