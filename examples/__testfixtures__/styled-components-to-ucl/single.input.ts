import styled from 'styled-components';
import { brandFont } from 'components/layout/brand-font';
import { primitive } from 'styles/constants/primitives';

export const RewardCategoriesContainer = styled.div`
  z-index: ${Styles.zIndex.below};
  padding-top: ${primitive.$spacing11};
  margin: ${primitive.$spacing3} ${primitive.$spacing3};
`;

export const TierLabel = styled.p`
  font: ${brandFont.headerTwo};
  font-family: ${Styles.fontFamily.alternative};
  font-size: 1rem;
`;
