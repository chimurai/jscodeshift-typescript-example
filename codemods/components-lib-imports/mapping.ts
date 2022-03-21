export const mapping = {
  // Basic remaps that should _just work_
  Box: { name: 'Box', import: '@rbilabs/universal-components' },
  VisuallyHidden: { name: 'VisuallyHidden', import: 'components/ucl' },
  TextInput: { name: 'TextInput', import: 'components/ucl/text-input' },
  ITextInputProps: { name: 'TextInputProps', import: 'components/ucl/text-input/types' },
  Select: { name: 'Select', import: '@rbilabs/universal-components' },
  Checkbox: { name: 'Checkbox', import: '@rbilabs/universal-components' },
  useMediaQuery: { name: 'useMediaQuery', import: 'hooks/use-media-query', defaultImport: true },
  NumberInput: { name: 'NumberInput', import: 'components/ucl' },
  Button: { name: 'Button', import: '@rbilabs/universal-components' },
  OnClick: { name: 'OnPress', import: '@rbilabs/frontend' },
  Dialog: { name: 'Dialog', import: 'components/dialog' },
  DateInput: { name: 'DateInput', import: 'components/ucl' },
  IDateInputProps: { name: 'IDateInputProps', import: 'components/ucl/date-input/types' },
  RewardsChip: { name: 'RewardsBadge', import: '@rbilabs/universal-components' },

  // Harder remaps but doable.
  Chip: {
    name: 'Badge',
    import: '@rbilabs/universal-components',
    mod: () => {
      // Add JSXAttribute variant="default-solid"
    },
  },
  ChipProps: { create: `type ChipProps = React.ComponentProps<typeof Chip>` },
  Icon: {
    name: 'Icon',
    import: 'components/ucl',
    mod: () => {
      // remap props and icon names??
    },
  },
  InlineAlert: {
    name: 'InlineAlert',
    import: '@rbilabs/universal-components',
    mod: () => {
      // Add JSX Attribute status="info"
    },
  },
  ICheckboxProps: { create: 'type ICheckboxProps = React.ComponentProps<typeof Checkbox>' },
  ISelectProps: { create: 'type ISelectProps = React.ComponentProps<typeof Select>' },
  RotateIcon: {
    name: 'RotateAnimatedView',
    import: 'components/ucl',
    mod: () => {
      // TODO: Update JSXAttributes on previous <RotateIcon active={}> to <RotateAnimatedView isRotated={}>
    },
  },
  // Only used in one file. Drop the import and hardcode
  LinkObject: { create: `type LinkObject = { _key: string, locale: string, text: string }` },
  mediaQuery: false, // TODO: This is used once. Drop the import and hardcode the values in that file.
  // this is basically a Badge with the correct icon per brand and a variant="default-solid"
  // i think we could build this quick in UCL and import it

  // Kind of sure, but not totally sure if this is right.
  Toggle: { name: 'Switch', import: '@rbilabs/universal-components' },
  IToggleOption: { create: `type ISwitchOption = React.ComponentProps<typeof Switch>` },

  // Not sure yet... where do these remap to??
  RadioButton: false,
  OutlineButton: {
    name: 'Button',
    import: '@rbilabs/universal-components',
    mod: () => {
      // add JSXAttribute variant="outline"
    },
  },

  ThemeColorArg: false,
  getThemeColor: false,
  MenuCarousel: false,
  MenuCarouselItem: false,
  MenuCarouselItemProps: false,
  useMenuCarouselHandler: false,

  // Not sure yet.. but i think we skip these ones:
  useDialogUIState: false, // only used in one file. I think we should just do this one manually
  LocaleSelect: false, // Only used in one file. Maybe we skip that file.
  IIcon: false, // Its used to get the `keyof IIcon` e.g., a type of all the Icon names
  Footer: false, // This doesnt apply to mobile usage. Maybe we skip this file because it wont be part of the initial migration
  IFooterProps: false,
  TextOnlyButton: false, // this is used in one file, and it's wrapped in styled and exposed over exports. I think we log manual work and leave it.
  TextArea: false, // Only used in one file, it's a formik file. So I think we leave this import and skip over the file
  ITextAreaProps: false,

  // drop these imports
  themeBk: false,
  themeTh: false,
  themePlk: false,
  GlobalStylesBk: false,
  GlobalStylesPlk: false,
  GlobalStylesTh: false,
};
