import { Exclude, Expose } from 'class-transformer';
import { IBranch } from 'src/common/interfaces/branch.interface';

@Exclude()
export class BranchDto implements IBranch {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  branch_alias: string;
}
