import { Collection, FileInfo, JSCodeshift } from 'jscodeshift';
import { logManualWork } from '../logger';

export function transformRenameOnclick(root: Collection<any>, j: JSCodeshift, file: FileInfo) {
  // Mapping of things variables like { onClick: 'onPress' }
  const identifiersToRename = {} as Record<string, string>;

  // 1. Rename any jsx attributes, and record their identifier names
  //    to mutate on step 2.
  root.find(j.JSXAttribute).forEach(node => {
    // rename attr
    if (node.value.name.name === 'onClick') {
      node.value.name.name = 'onPress';
    }

    if (
      node.value.value?.type === 'JSXExpressionContainer' &&
      node.value.value.expression.type === 'Identifier'
    ) {
      identifiersToRename[node.value.value.expression.name] =
        node.value.value.expression.name.replace('Click', 'Press');
    }

    // TODO: rename the handler from props if possible

    // TODO: rename the type definition
  });

  // 2. Loop over identifiers and update their declarations and usages for various possibilities including
  //    a. Variables
  //    b. function arguments (props)
  //    c. deconstructed function arguments ({ onClick })
  Object.entries(identifiersToRename).forEach(([identifier, newIdentifier]) => {
    // 2.a
    root.findVariableDeclarators(identifier).renameTo(newIdentifier);

    // 2.b
    root
      .find(j.MemberExpression, {
        property: {
          name: identifier,
        },
      })
      .find(j.Identifier, {
        name: identifier,
      })
      .forEach(p => {
        p.value.name = newIdentifier;
      });

    // 2.c
    root
      .find(j.FunctionDeclaration)
      .find(j.ObjectProperty, {
        key: {
          name: identifier,
        },
      })
      .forEach(p => {
        j(p.scope.path)
          .find(j.Identifier, { name: identifier })
          .forEach(p => {
            p.node.name = newIdentifier;
          });
      });
  });

  // 3. Update any type definitions that are named `onClick`
  root
    .find(j.TSPropertySignature, {
      key: {
        name: 'onClick',
      },
    })
    .forEach(p => {
      if (p.node.key.type === 'Identifier') {
        p.node.key.name = 'onPress';
      } else {
        logManualWork({
          filePath: file.path,
          helpfulMessage: `Unable to figure out the translation of the type definition for a click handler that should be migrated to a "press" handler`,
          startingLine: p.node.loc?.start.line ?? 0,
          endingLine: p.node.loc?.end.line ?? 0,
        });
      }
    });

  // 4. Special handling for WhiteLabel where we have an `OnClick` import from either:
  //    `@rbilabs/component-library`
  //    `@rbi-ctg/frontend`
  // We're not doing the fancy of work of solving the imports. Just changing the prop name
  // and then typescript/lint will inform us where we need to fix the imports manually.
  root
    .find(j.ImportSpecifier, {
      imported: {
        name: 'OnClick',
      },
    })
    .forEach(p => {
      j(p.scope.path)
        .find(j.Identifier, { name: 'OnClick' })
        .forEach(p => {
          p.node.name = 'OnPress';
        });
    });
}
