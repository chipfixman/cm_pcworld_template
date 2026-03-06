import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Activity extends Document {
  @Prop({ required: true })
  action: string;

  @Prop()
  entityType: string;

  @Prop()
  entityId: string;

  @Prop()
  userId: number;

  @Prop()
  details: string;

  @Prop({ type: Object })
  meta: Record<string, unknown>;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
