import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResourceDocument = Resource & Document;

@Schema({ timestamps: true })
export class Resource {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  url: string;

  @Prop({ required: true })
  category: string; // waste-reduction | storage | nutrition | budget

  @Prop({ required: true })
  type: string; // article | video | guide
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
