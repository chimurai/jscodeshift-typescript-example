import styled from 'styled-components';

import ActionButton from 'components/action-button';
import LoyaltyPointsIcon from 'components/icons/loyalty-points-icon';
import Picture from 'components/picture';
import LoyaltyRewardsLogo from 'pages/loyalty/loyalty-rewards-logo';
import { primitive } from 'styles/constants/primitives';
import { fadeIn } from 'utils/style/animations';
import theme from '../../constants/theme';

export const UnauthenticatedContainer = styled.div<{ center: boolean }>`
  align-items: ${props => (props.center ? 'center' : 'flex-end')};
`;


export const FullScreenOverlay = styled.div`
  width: 100%;
  background-color: ${theme.backgroundColor};
`
