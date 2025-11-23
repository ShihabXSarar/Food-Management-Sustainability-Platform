import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FoodLogDocument = FoodLog & Document;

@Schema({ timestamps: true })
export class FoodLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  quantity: number;
}

export const FoodLogSchema = SchemaFactory.createForClass(FoodLog);
