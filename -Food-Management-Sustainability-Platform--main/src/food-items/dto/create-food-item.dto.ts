import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateFoodItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNumber()
  @Min(1)
  expirationDays: number;

  @IsNumber()
  @Min(1)
  costPerUnit: number;
}
