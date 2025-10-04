import type { API, FileInfo } from 'jscodeshift';
import type { TestOptions } from 'jscodeshift/src/testUtils';

/**
 * JSCodeshift transformer to convert lodash named imports to deep imports.
 *
 * Transforms:
 *   import { map, filter } from 'lodash';
 * To:
 *   import map from 'lodash/map';
 *   import filter from 'lodash/filter';
 *
 * This transformation helps with tree-shaking and reduces bundle size by only
 * importing the specific lodash functions needed.
 *
 * @license MIT
 * @copyright 2025 - Created with https://github.com/chimurai/jscodeshift-typescript-example
 * @description Run this transformer with jscodeshift: `npx jscodeshift -t src/lodash-deep-imports.ts *.ts --print --dry`
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
    // Return early if no lodash imports found - no transformation needed
    return file.source;
  }

  // Store new deep import statements to be added
  const newImports: any[] = [];
  let hasNamedImports = false;

  // Process each lodash import declaration
  lodashImports.forEach(path => {
    const importDeclaration = path.value;

    // Track if this import has named imports that need to be converted
    let hasNamedImportsInThisDeclaration = false;

    // Store non-named imports to preserve (default and namespace imports)
    const preservedSpecifiers: any[] = [];

    // Only process named imports (destructured imports like { map, filter })
    if (importDeclaration.specifiers) {
      importDeclaration.specifiers.forEach(specifier => {
        // Handle named imports: import { functionName } from 'lodash'
        if (j.ImportSpecifier.check(specifier)) {
          // Get the imported name (what we're importing from lodash)
          const importedName = specifier.imported.name;
          // Get the local name (what we call it in our code, handles aliases)
          const localName = specifier.local?.name || importedName;

          // Create a new default import for each lodash function
          // Convert: import { map } from 'lodash'
          // To: import map from 'lodash/map'
          const newImport = j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier(localName as string))],
            j.literal(`lodash/${importedName}`)
          );

          newImports.push(newImport);
          hasNamedImportsInThisDeclaration = true;
          hasNamedImports = true;
        } else {
          // Preserve default imports (import _) and namespace imports (import * as _)
          // These don't need to be converted to deep imports
          preservedSpecifiers.push(specifier);
        }
      });
    }

    // Modify or remove the original import declaration
    if (hasNamedImportsInThisDeclaration) {
      if (preservedSpecifiers.length > 0) {
        // Update the original import to only include non-named imports
        // For example: import _, { map } from 'lodash' becomes import _ from 'lodash'
        importDeclaration.specifiers = preservedSpecifiers;
      } else {
        // Remove the original import completely if it only had named imports
        j(path).remove();
      }
    }
  });

  // Add all new deep import statements at the top of the file
  if (hasNamedImports && newImports.length > 0) {
    // Find the first import statement or the first statement in the file
    const firstImport = root.find(j.ImportDeclaration).at(0);
    const firstStatement = root.find(j.Program).get('body', 0);

    if (firstImport.length > 0) {
      // Insert new deep imports before the first existing import
      // This maintains proper import ordering
      newImports.forEach(importStmt => {
        firstImport.insertBefore(importStmt);
      });
    } else {
      // Insert at the beginning of the program if no imports exist
      newImports.forEach(importStmt => {
        firstStatement.insertBefore(importStmt);
      });
    }
  }

  // Convert the AST back to source code with consistent formatting
  return root.toSource({
    quote: 'single',        // Use single quotes for strings
    trailingComma: true,    // Add trailing commas where appropriate
  });
}

// Use TypeScript parser for transformations to support TypeScript syntax
export const parser: TestOptions['parser'] = 'ts';
