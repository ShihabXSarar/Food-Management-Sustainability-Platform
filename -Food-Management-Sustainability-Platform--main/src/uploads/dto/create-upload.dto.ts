import { IsOptional, IsIn, IsString } from 'class-validator';

export class CreateUploadDto {
  @IsOptional()
  @IsIn(['inventory', 'consumption-log'])
  associatedWith?: 'inventory' | 'consumption-log';

  @IsOptional()
  @IsString()
  associatedId?: string;
}
