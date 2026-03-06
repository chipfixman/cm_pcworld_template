import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from './activity.schema';

@Injectable()
export class ActivityService {
  constructor(@InjectModel(Activity.name) private model: Model<Activity>) {}

  async log(data: { action: string; entityType?: string; entityId?: string; userId?: number; details?: string; meta?: Record<string, unknown> }) {
    const doc = new this.model(data);
    return doc.save();
  }

  async findRecent(limit = 50) {
    return this.model.find().sort({ createdAt: -1 }).limit(limit).lean().exec();
  }
}
