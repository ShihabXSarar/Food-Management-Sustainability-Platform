import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: Types.ObjectId, ref: 'FoodItem', required: true })
  item: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  expiryDate: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
