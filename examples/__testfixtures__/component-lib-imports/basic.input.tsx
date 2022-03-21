import {
  Box,
  VisuallyHidden,
  TextInput,
  ITextInputProps,
  Checkbox,
  ICheckboxProps,
  NumberInput,
  Button,
  RadioButton,
  OutlineButton,
  TextOnlyButton,
  mediaQuery,
  Chip,
  ChipProps,
  RotateIcon,
  LocaleSelect,
  Icon,
  IIcon,
  LinkObject,
  Toggle,
  IToggleOption,
  InlineAlert,
  OnClick,
  ThemeColorArg,
  getThemeColor,
  Select,
  ISelectProps,
  Dialog,
  useDialogUIState,
  useMediaQuery,
  MenuCarousel,
  MenuCarouselItem,
  MenuCarouselItemProps,
  RewardsChip,
  useMenuCarouselHandler,
  DateInput,
  IDateInputProps,
} from '@rbilabs/components-library';

function Component(props: ITextInputProps & {}) {
  return (
    <>
      <RewardsChip rewardsLocked />
      <OutlineButton />
      <RotateIcon active={true} />
      <Chip />
      <InlineAlert />
    </>
  )
}