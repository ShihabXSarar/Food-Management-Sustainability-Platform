import {
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
  IsIn,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
 // @IsIn(['veg', 'non-veg', 'general', 'budget'], { each: false })
  dietaryPreference?: string;

  @IsOptional()
  @IsNumber()
  householdSize?: number;

  // if user wants to change password
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
