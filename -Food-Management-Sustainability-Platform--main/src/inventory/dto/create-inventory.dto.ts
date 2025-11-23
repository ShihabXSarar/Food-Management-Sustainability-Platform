import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsString()
  item: string; // FoodItem ID

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsDateString()
  expiryDate: string;
}
