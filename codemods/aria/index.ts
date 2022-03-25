import { Collection, JSCodeshift, FileInfo } from 'jscodeshift';

export function transformAria(root: Collection<any>, j: JSCodeshift, file: FileInfo) {
  root
    .findJSXElements()
    .find(j.JSXAttribute, { name: { name: 'aria-label' } })
    .forEach(p => {
      p.value.name.name = 'accessibilityLabel';
    });
}
