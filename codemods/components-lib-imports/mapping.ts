import { Collection, JSCodeshift } from 'jscodeshift';

type Instruction = {
  bail?: boolean;
  skip?: boolean;
  helpfulMessage?: string;
  name?: string;
  import?: string;
  defaultImport?: boolean;
  mod?(root: Collection<any>, j: JSCodeshift): void;
  postMod?(root: Collection<any>, j: JSCodeshift): void;
};

export const mapping: Record<string, Instruction> = {
  // Basic remaps that should _just work_
  Box: { name: 'Box', import: '@rbilabs/universal-components' },
  VisuallyHidden: { name: 'VisuallyHidden', import: 'components/ucl' },
  TextInput: { name: 'TextInput', import: 'components/ucl/text-input' },
  Select: { name: 'Select', import: '@rbilabs/universal-components' },
  Checkbox: { name: 'Checkbox', import: '@rbilabs/universal-components' },
  useMediaQuery: { name: 'useMediaQuery', import: 'hooks/use-media-query', defaultImport: true },
  NumberInput: { name: 'NumberInput', import: 'components/ucl' },
  Button: { name: 'Button', import: '@rbilabs/universal-components' },
  OnClick: { name: 'OnPress', import: '@rbi-ctg/frontend' },
  Dialog: { name: 'Dialog', import: 'components/dialog' },
  DateInput: { name: 'DateInput', import: 'components/ucl' },
  IDateInputProps: { name: 'IDateInputProps', import: 'components/ucl/date-input/types' },

  Icon: {
    name: 'Icon',
    import: '@rbilabs/universal-components',
    helpfulMessage: `Icon from legacy component library needs a manual migration of the icon name props to the UCL variant.`,
  },

  // Harder remaps but doable.
  RewardsChip: {
    name: 'RewardsBadge',
    import: '@rbilabs/universal-components',

    // rename attr `rewardsLocked` to `isLocked`
    mod(root: Collection<any>, j: JSCodeshift) {
      root.find(j.JSXOpeningElement, { name: { name: 'RewardsChip' } }).forEach(p => {
        (p.value.attributes ?? []).forEach(attr => {
          if (attr.type === 'JSXAttribute' && attr.name.name === 'rewardsLocked') {
            attr.name.name = 'isLocked';
          }
        });
      });
    },
  },
  Chip: {
    name: 'Badge',
    import: '@rbilabs/universal-components',
    // Add attr variant="default-solid"
    mod(root: Collection<any>, j: JSCodeshift) {
      root.find(j.JSXOpeningElement, { name: { name: 'Chip' } }).forEach(p => {
        p.value.attributes = p.value.attributes || [];
        p.value.attributes.push(
          j.jsxAttribute(j.jsxIdentifier('variant'), j.jsxText('"default-solid"'))
        );
      });
    },
  },
  InlineAlert: {
    name: 'InlineAlert',
    import: '@rbilabs/universal-components',
    // Add attr status="info"
    mod(root: Collection<any>, j: JSCodeshift) {
      root.find(j.JSXOpeningElement, { name: { name: 'InlineAlert' } }).forEach(p => {
        p.value.attributes = p.value.attributes || [];
        p.value.attributes.push(j.jsxAttribute(j.jsxIdentifier('status'), j.jsxText('"info"')));
      });
    },
  },
  RotateIcon: {
    name: 'RotateAnimatedView',
    import: 'components/ucl',
    // Update attr <RotateIcon active={}> to <RotateAnimatedView isRotated={}>
    mod(root: Collection<any>, j: JSCodeshift) {
      root.find(j.JSXOpeningElement, { name: { name: 'RotateIcon' } }).forEach(p => {
        (p.value.attributes ?? []).forEach(attr => {
          if (attr.type === 'JSXAttribute' && attr.name.name === 'active') {
            attr.name.name = 'isRotated';
          }
        });
      });
    },
  },
  OutlineButton: {
    name: 'Button',
    import: '@rbilabs/universal-components',
    // add attr variant="outline"
    mod(root: Collection<any>, j: JSCodeshift) {
      root.find(j.JSXOpeningElement, { name: { name: 'OutlineButton' } }).forEach(p => {
        p.value.attributes = p.value.attributes ?? [];
        p.value.attributes.push(j.jsxAttribute(j.jsxIdentifier('variant'), j.jsxText('"outline"')));
      });
    },
  },
  // Only used in one file. Drop the import and hardcode
  LinkObject: {
    mod(root: Collection<any>, j: JSCodeshift) {
      root.find(j.Program).forEach(p => {
        p.value.body.unshift(
          j.typeAlias(
            j.identifier('LinkObject'),
            null,
            j.objectTypeAnnotation([
              j.objectTypeProperty(j.identifier('_key'), j.stringTypeAnnotation(), false),
              j.objectTypeProperty(j.identifier('locale'), j.stringTypeAnnotation(), false),
              j.objectTypeProperty(j.identifier('text'), j.stringTypeAnnotation(), false),
            ])
          )
        );
      });
    },
  },
  TextOnlyButton: {
    name: 'Button',
    import: '@rbilabs/universal-components',
    postMod(root: Collection<any>, j: JSCodeshift) {
      root.find(j.Program).forEach(p => {
        p.value.body.unshift(
          j.variableDeclaration.from({
            kind: 'const',
            declarations: [
              j.variableDeclarator.from({
                id: j.identifier('TextOnlyButton'),
                init: j.callExpression.from({
                  callee: j.memberExpression.from({
                    object: j.identifier('Button'),
                    property: j.identifier('withConfig'),
                  }),
                  arguments: [
                    j.objectExpression([
                      j.objectProperty.from({
                        key: j.identifier('variant'),
                        value: j.stringLiteral('ghost'),
                      }),
                    ]),
                  ],
                }),
              }),
            ],
          })
        );
      });
    },
  },

  // Kind of sure, but not totally sure if this is right.
  Toggle: { name: 'Switch', import: '@rbilabs/universal-components' },

  // Not sure yet... where do these remap to??
  RadioButton: { skip: true },

  IToggleOption: {
    skip: true,
    helpfulMessage:
      'Codemodding `IToggleOption` import from component-library is more work than handling manually. Update any references to import `IToggleOption` from `type ISwitchOption = React.ComponentProps<typeof Switch>` where Switch is from UCL',
  },
  ISelectProps: {
    skip: true,
    helpfulMessage:
      'Codemodding `ISelectProps` import from component-library is more work than handling manually. Update any references to import `ISelectProps` from `type ISelectProps = React.ComponentProps<typeof Select>` where Select is from UCL',
  },
  ICheckboxProps: {
    skip: true,
    helpfulMessage:
      'Codemodding `ICheckboxProps` import from component-library is more work than handling manually. Update any references to import `ICheckboxProps` from `type ICheckboxProps = React.ComponentProps<typeof Checkbox>` where Checkbox is from UCL',
  },
  ChipProps: {
    skip: true,
    helpfulMessage:
      'Codemodding `ChipProps` import from component-library is more work than handling manually. Update any references to import `ChipProps` from `type BadgeProps = React.ComponentProps<typeof Badge>` where Badge is from UCL',
  },
  mediaQuery: {
    skip: false,
    helpfulMessage:
      'Codemodding `mediaQuery` import from component-library is more work than handling manually. Remove the import and hardcode the values.',
  },

  ITextInputProps: {
    skip: true,
    helpfulMessage:
      'Codemodding `ITextInputProps` import from component-library is more work than handling manually. Update any references to import `TextInputProps` from `components/ucl/text-input/types`',
  },

  ThemeColorArg: {
    skip: true,
    helpfulMessage:
      'Codemodding `ThemeColorArg` doesnt have an obvious migration path. Inspect and find a better solution',
  },
  getThemeColor: {
    skip: true,
    helpfulMessage:
      'Codemodding `getThemeColor` doesnt have an obvious migration path. Inspect and find a better solution',
  },
  MenuCarousel: {
    skip: true,
    helpfulMessage:
      'Codemodding `MenuCarousel` doesnt have an obvious migration path. Inspect and find a better solution',
  },
  MenuCarouselItem: {
    skip: true,
    helpfulMessage:
      'Codemodding `MenuCarouselItem` doesnt have an obvious migration path. Inspect and find a better solution',
  },
  MenuCarouselItemProps: {
    skip: true,
    helpfulMessage:
      'Codemodding `MenuCarouselItemProps` doesnt have an obvious migration path. Inspect and find a better solution',
  },
  useMenuCarouselHandler: {
    skip: true,
    helpfulMessage:
      'Codemodding `useMenuCarouselHandler` doesnt have an obvious migration path. Inspect and find a better solution',
  },

  // Not sure yet.. but i think we skip these ones:
  useDialogUIState: {
    skip: true,
    helpfulMessage:
      'Codemodding `useDialogUIState` doesnt have an obvious migration path. Inspect and find a better solution',
  }, // only used in one file. I think we should just do this one manually
  LocaleSelect: {
    skip: true,
    helpfulMessage:
      'Codemodding `LocaleSelect` doesnt have an obvious migration path. Inspect and find a better solution',
  }, // Only used in one file. Maybe we skip that file.
  IIcon: {
    skip: true,
    helpfulMessage:
      'Codemodding `IIcon` doesnt have an obvious migration path. Inspect and find a better solution',
  }, // Its used to get the `keyof IIcon` e.g., a type of all the Icon names

  // Bail on any files that uses these.
  Footer: { bail: true },
  IFooterProps: { bail: true },
  themeBk: { bail: true },
  themeTh: { bail: true },
  themePlk: { bail: true },
  GlobalStylesBk: { bail: true },
  GlobalStylesPlk: { bail: true },
  GlobalStylesTh: { bail: true },
};
