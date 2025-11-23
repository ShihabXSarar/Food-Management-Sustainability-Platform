import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FoodItemDocument = FoodItem & Document;

@Schema({ timestamps: true })
export class FoodItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string; // fruit, grain, dairy, vegetable etc

  @Prop({ required: true })
  expirationDays: number;

  @Prop({ required: true })
  costPerUnit: number;
}

export const FoodItemSchema = SchemaFactory.createForClass(FoodItem);
