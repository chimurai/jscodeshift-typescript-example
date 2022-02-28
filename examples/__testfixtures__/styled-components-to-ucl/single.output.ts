import { Box, Text } from '@rbilabs/universal-components';
import { brandFont } from 'components/layout/brand-font';
import { primitive } from 'styles/constants/primitives';

export const RewardCategoriesContainer = Box.withConfig({
  zIndex: Styles.zIndex.below,
  paddingTop: '$20',
  margin: '$3 $3'
});

export const TierLabel = Text.withConfig({
  font: brandFont.headerTwo,
  fontFamily: 'alternative',
  fontSize: '1rem'
});
