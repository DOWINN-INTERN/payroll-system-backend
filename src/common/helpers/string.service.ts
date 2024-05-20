import { Injectable } from '@nestjs/common';

@Injectable()
export class StringHelper {
  private result: string;
  /**
   *
   * @param string
   * @returns
   * @description Removes whitespace at the beginning, middle, and end of the string.
   */
  removeWhiteSpace(param: string): string {
    this.result = param.trim().replace(/[\s-]/g, '');
    return this.result;
  }
  toLowerCase(): string {
    return this.result.toLowerCase();
  }
}
