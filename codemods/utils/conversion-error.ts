import { FileInfo } from 'jscodeshift';

export class ConversionError extends Error {
  file: FileInfo;
  reason: string;

  constructor(file: FileInfo, reason: string) {
    super(reason);

    this.file = file;
    this.reason = reason;
  }
}
