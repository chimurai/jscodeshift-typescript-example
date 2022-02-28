import { Box, Text } from '@rbilabs/universal-components';
import { brandFont } from 'components/layout/brand-font';
import { primitive } from 'styles/constants/primitives';

export const RewardCategoriesContainer = Box.withConfig({
  zIndex: Styles.zIndex.below,
  paddingTop: '$20'
});

export const TierLabel = Text.withConfig({
  variant: 'headerTwo',
  fontFamily: Styles.fontFamily.alternative,
  fontSize: '1rem'
});
