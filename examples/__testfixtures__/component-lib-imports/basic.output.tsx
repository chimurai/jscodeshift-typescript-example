import { IDateInputProps } from 'components/ucl/date-input/types';
import { DateInput, NumberInput, RotateAnimatedView, VisuallyHidden } from 'components/ucl';

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Icon,
  InlineAlert,
  RewardsBadge,
  Select,
  Switch,
} from '@rbilabs/universal-components';

import useMediaQuery from 'hooks/use-media-query';
import { Dialog } from 'components/dialog';
import { OnPress } from '@rbi-ctg/frontend';

type LinkObject = {
  _key: string,
  locale: string,
  text: string,
};

const TextOnlyButton = Button.withConfig({
  variant: 'ghost',
});

import { TextInput } from 'components/ucl/text-input';
import {
  ITextInputProps,
  ICheckboxProps,
  RadioButton,
  mediaQuery,
  ChipProps,
  LocaleSelect,
  IIcon,
  LinkObject,
  IToggleOption,
  ThemeColorArg,
  getThemeColor,
  ISelectProps,
  useDialogUIState,
  MenuCarousel,
  MenuCarouselItem,
  MenuCarouselItemProps,
  useMenuCarouselHandler,
} from '@rbilabs/components-library';

function Component(props: ITextInputProps & {}) {
  return <>
    <RewardsBadge isLocked />
    <Button variant="outline" />
    <RotateAnimatedView isRotated={true} />
    <Badge variant="default-solid" />
    <InlineAlert status="info" />
  </>;
}