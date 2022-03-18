import styled from 'styled-components';

import { Container as EmptyStateContainer } from 'components/empty-state';
import { brandFont } from 'components/layout/brand-font';
import Link from 'components/link';
import { primitive } from 'styles/constants/primitives';

export const ScrollContainer = styled.div`
  position: relative;
  height: calc(100% - 164px);
  padding-top: 7.75rem;
  overflow-y: auto;
`;

export const TrackOrderLink = styled(Link)`
  border: 1px solid ${p => p.theme.token('border-color-button-secondary')};
  border-radius: 2rem;
  margin: ${primitive.$spacing1} 0;
  padding: ${primitive.$spacing1} ${primitive.$spacing3} ${primitive.$spacing1};
  font-size: 0.7em;
  color: ${p => p.theme.token('text-button-secondary')};
  appearance: none;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
  ${Styles.desktop`
    position: absolute;
    right: ${primitive.$spacing7};
    top: ${primitive.$spacing6};
`}
  &:hover {
    background: ${p => p.theme.token('background-button-primary-default')};
    color: ${p => p.theme.token('text-link-reversed')};
  }
`;

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

export const ButtonCol = styled(Col)`
  display: flex;
`;

export const MoreItems = styled.button`
  color: ${p => p.theme.token('text-button-secondary')};
  background: none;
  border: none;
  padding: 0;
  font: ${brandFont.copyOne};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
export const FormattedDate = styled.div`
  font: ${brandFont.headerTwo};
  text-transform: ${Styles.textTransform.headlines};
  margin-bottom: ${primitive.$spacing1};
`;

export const SubtitleContainer = styled.p`
  display: inline-flex;
  font-weight: bold;
  align-items: center;
  color: ${p => p.theme.token('text-default')};
`;

export const CateringPendingApproval = styled.p`
  font: ${brandFont.copyTwo};
  color: ${primitive.$error};
  margin: 0;
`;

export const NumItems = styled.span`
  margin-left: ${primitive.$spacing1};
`;

export const Items = styled.p`
  position: relative;
  line-height: 1.5rem;
  max-height: 3rem;
  padding-right: ${primitive.$spacing4};
  overflow: hidden;
  margin: 0;
`;

export const ItemNameContainer = styled.div`
  display: flex;
  align-items: center;

  p {
    color: ${p => p.theme.token('text-default')};
  }
`;

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

export const RecentOrderTitle = styled.h2`
  margin: ${primitive.$spacing7} 0;
  margin-bottom: ${primitive.$spacing5};
  color: ${p => p.theme.token('text-default')} !important;
  font-size: 2.25rem;
  text-align: center;
  ${Styles.desktop`
    font-size: 3.5rem;
  `}
`;

export const OrderNumber = styled.p`
  font: ${brandFont.headerThree};
  color: ${p => p.theme.token('text-accent-order-number')};
  margin: 0;
`;

export const OrderNumberWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: ${primitive.$spacing4} 0;
`;

export const OrderNumberText = styled.p`
  font: ${brandFont.headerThree};
  text-transform: capitalize;
  margin: 0 ${primitive.$spacing1} 0 0;
`;
