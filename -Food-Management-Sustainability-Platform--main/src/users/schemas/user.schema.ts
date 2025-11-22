import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  location: string;

  @Prop({ default: 'general' })
  dietaryPreference: string; // e.g. 'veg' | 'non-veg' | 'budget'

  @Prop({ default: 1 })
  householdSize: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
