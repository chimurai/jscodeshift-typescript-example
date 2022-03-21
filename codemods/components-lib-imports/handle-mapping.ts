import { Collection, FileInfo, JSCodeshift } from 'jscodeshift';
import { logManualWork } from '../../logger';
import { ConversionError } from '../utils/conversion-error';
import { registerImportSpecifiers } from '../utils/register-ucl-import-specifiers';
import { mapping } from './mapping';

// this file runs the instructions from the mapping. It's goal is a few things:
// 1, log any helpful messages for engineers to manually do
// 2, remove the import from the component library
// 3, if the variable name was changed, update any identifiers referencing it
// 4, if the instruction has a custom mod, run that first
// 5, translate the imports from the component library to their expected import place
export function handleMapping(
  nodeName: string,
  root: Collection<any>,
  j: JSCodeshift,
  fileInfo: FileInfo
) {
  const instructions = mapping[nodeName];

  if (instructions.helpfulMessage) {
    logManualWork({
      filePath: fileInfo.path,
      helpfulMessage: instructions.helpfulMessage,
      startingLine: 0,
      endingLine: 0,
      skipSource: true,
    });
  }

  if (instructions.bail) {
    throw new ConversionError(
      fileInfo,
      `The Component library import for ${nodeName} is unmodable and requires manual intervention.`
    );
  }

  if (instructions.skip === true) {
    return;
  }

  if (instructions.mod) {
    instructions.mod(root, j);
  }

  if (instructions.defaultImport) {
    // remove import first. Otherwise we'll have a scope conflict
    // and run the program path to rename the import
    removeImport(root, j, nodeName, instructions.name);

    // handle default imports to a given import path
    // handling them as a bit of a one off.
    root.find(j.Program).forEach(path => {
      path.node.body.unshift(
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier(nodeName))],
          j.stringLiteral(instructions.import)
        )
      );
    });
    // handles any basic imports to a given path
  } else if (instructions.import && instructions.name) {
    // remove import first. Otherwise we'll have a scope conflict
    // and run the program path to rename the import
    removeImport(root, j, nodeName, instructions.name);

    // register the import specifier to the given import path
    registerImportSpecifiers(root, j, instructions.name, instructions.import);
  }

  if (instructions.postMod) {
    instructions.postMod(root, j);
  }
}

function removeImport(root: Collection<any>, j: JSCodeshift, nodeName: string, newName: string) {
  root
    .find(j.ImportSpecifier, {
      imported: {
        name: nodeName,
      },
    })
    .forEach(p => {
      j(p.scope.path)
        .find(j.Identifier, { name: nodeName })
        .forEach(p => {
          p.node.name = newName;
        });
    })
    .remove();
}
