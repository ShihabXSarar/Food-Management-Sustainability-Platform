


export enum UploadType {

  RECEIPT = 'receipt'
 
}
// src/upload/upload.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true })
export class Upload {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop()
  publicId: string;

  @Prop()
  originalName: string;

  @Prop()
  mimeType: string;

  @Prop()
  size: number;

  @Prop({ default: 'receipts' })
  folder: string;

  @Prop({ default: 'receipt' })
  type: string; // sudhu "receipt"
}

export const UploadSchema = SchemaFactory.createForClass(Upload);



