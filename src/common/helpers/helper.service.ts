import { Injectable } from '@nestjs/common';
import { StringHelper } from './string.service';

@Injectable()
export class HelperService {
  constructor(private stringHelper: StringHelper) {}
  /**
   *
   * @param string
   * @returns
   */
  createAlias(param: string): string {
    const alias = this.stringHelper.removeWhiteSpace(param);
    return alias;
  }
}
