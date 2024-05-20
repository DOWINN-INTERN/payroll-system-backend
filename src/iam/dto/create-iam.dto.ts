interface Permission {
  action: string;
  subject: string;
}
export class CreateIamDto {
  name: string;
  branchId?: string;
  departmentId?: string;
  permissions: Permission[];
}
