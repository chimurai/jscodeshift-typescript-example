import { Text, Box } from '@rbilabs/universal-components';

import { ModalHeading } from 'components/modal';

import { ModalContent } from '../styled';

import { HEADER_TOP_PADDING, IMAGE_BACKGROUND_COLOR } from './checking-availability-constants';

export const Container = ModalContent.withConfig({
  height: '100%',
  alignItems: 'center',
});

export const StyledModalHeader = ModalHeading.withConfig({
  alignSelf: 'center',
  lineHeight: 40,
  paddingBottom: 0,
  borderBottomWidth: 0,
  borderBottomColor: 'black',
  borderBottomStyle: 'solid',

  paddingTop: {
    lg: 0,
  },
})/*
TODO RN: unsupported CSS
Some attributes were not converted.

export const StyledModalHeader = styled(ModalHeading)`
  margin: 0 auto 1rem;
  font-size: 2rem;
  line-height: 2.5rem;
  font-size: 0.9375rem;
  padding-bottom: 0px;
  border-bottom: 0px;
  ${Styles.desktop`
    padding-top: 0;
  `}
`;

*/;

export const LoadingText = Text.withConfig({
  textAlign: 'center',
  fontSize: 15,
  variant: Styles.fontFamily.body,
  paddingX: '$10',
  paddingY: '7px',
})/*
TODO RN: unsupported CSS
Some attributes were not converted.

export const LoadingText = styled.p`
  text-align: center;
  font-size: 0.9375rem;
  line-height: 1.33;
  font-family: ${Styles.fontFamily.body};
  padding: 0.4375rem 2.5rem;
`;

*/;

export const LoadingGraphicWrapper = Box.withConfig({
  height: '240px',
  width: '240px',
  borderTopLeftRadius: '50%',
  borderTopRightRadius: '50%',
  borderBottomRightRadius: '50%',
  borderBottomLeftRadius: '50%',
  alignSelf: 'center',
  marginTop: '$4',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
})/*
TODO RN: unsupported CSS
Some attributes were not converted.

export const LoadingGraphicWrapper = styled.div`
  height: 15rem;
  width: 15rem;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 16px;
  background: ${IMAGE_BACKGROUND_COLOR};
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

*/;

export const GraphicTextWrapper = Box.withConfig({
  // TODO RN: unsupported CSS
  // display: 'grid',

  gridTemplateRows: 'auto 1fr',
});
