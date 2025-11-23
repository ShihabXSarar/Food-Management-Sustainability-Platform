import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFoodLogDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
