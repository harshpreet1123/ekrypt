import { Schema, model, models } from 'mongoose';
import { ILink } from '@/interfaces/ILink';

const LinkSchema = new Schema<ILink>({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  expiresAt: { type: Date, default: null },
  ttlMinutes: { type: Number, default: null },
  maxClicks: { type: Number, default: null },
  clickCount: { type: Number, default: 0 },
  oneTimeOnly: { type: Boolean, default: false },
  passwordHash: { type: String, default: null },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  analytics: [{ type: Schema.Types.ObjectId, ref: "Analytics" }], // Corrected this line
  createdAt: { type: Date, default: Date.now, index: true },
});

export const Link = models.Link || model<ILink>('Link', LinkSchema);
