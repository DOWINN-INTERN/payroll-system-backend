import { PartialType } from '@nestjs/swagger';
import { CreateIamDto } from './create-iam.dto';

export class UpdateIamDto extends PartialType(CreateIamDto) {}
