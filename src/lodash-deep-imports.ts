import type { API, FileInfo } from 'jscodeshift';
import type { TestOptions } from 'jscodeshift/src/testUtils';

/**
 * JSCodeshift transformer to convert lodash named imports to deep imports.
 *
 * Transforms:
 *   import { pluck, map } from 'lodash';
 * To:
 *   import pluck from 'lodash/pluck';
 *   import map from 'lodash/map';
 *
 * This transformation helps with tree-shaking and reduces bundle size by only
 * importing the specific lodash functions needed.
 *
 * @license MIT
 * @copyright 2025 - Created with https://github.com/chimurai/jscodeshift-typescript-example
 * @description Run this transformer with jscodeshift: `npx jscodeshift -t src/lodash-deep-imports.ts <path/glob-to-files> --print --dry`
 */
export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find all import declarations that import from 'lodash'
  const lodashImports = root.find(j.ImportDeclaration, {
    source: {
      value: 'lodash'
    }
  });

  // Check if there are any lodash imports to transform
  if (lodashImports.length === 0) {
    return root.toSource();
  }

  // Store new import statements to be added
  const newImports: any[] = [];
  let hasNamedImports = false;

  // Process each lodash import declaration
  lodashImports.forEach(path => {
    const importDeclaration = path.value;

    // Track if this import has named imports that need to be converted
    let hasNamedImportsInThisDeclaration = false;

    // Store non-named imports to preserve
    const preservedSpecifiers: any[] = [];

    // Only process named imports (destructured imports)
    if (importDeclaration.specifiers) {
      importDeclaration.specifiers.forEach(specifier => {
        // Handle named imports: import { functionName } from 'lodash'
        if (j.ImportSpecifier.check(specifier)) {
          const importedName = specifier.imported.name;
          const localName = specifier.local?.name || importedName;

          // Create a new default import for each lodash function
          // import functionName from 'lodash/functionName'
          const newImport = j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier(localName as string))],
            j.literal(`lodash/${importedName}`)
          );

          newImports.push(newImport);
          hasNamedImportsInThisDeclaration = true;
          hasNamedImports = true;
        } else {
          // Preserve default imports and namespace imports
          preservedSpecifiers.push(specifier);
        }
      });
    }

    // If we had named imports, we need to modify or remove the original import
    if (hasNamedImportsInThisDeclaration) {
      if (preservedSpecifiers.length > 0) {
        // Update the original import to only include non-named imports
        importDeclaration.specifiers = preservedSpecifiers;
      } else {
        // Remove the original import completely
        j(path).remove();
      }
    }
  });

  // Add all new import statements at the top of the file
  if (hasNamedImports && newImports.length > 0) {
    // Find the first import or the first statement if no imports exist
    const firstImport = root.find(j.ImportDeclaration).at(0);
    const firstStatement = root.find(j.Program).get('body', 0);

    if (firstImport.length > 0) {
      // Insert before the first existing import - insert each one at a time
      newImports.forEach(importStmt => {
        firstImport.insertBefore(importStmt);
      });
    } else {
      // Insert at the beginning of the program
      newImports.forEach(importStmt => {
        firstStatement.insertBefore(importStmt);
      });
    }
  }

  return root.toSource({
    quote: 'single',
    trailingComma: true,
  });
}

// Use TypeScript parser for transformations
export const parser: TestOptions['parser'] = 'ts';
