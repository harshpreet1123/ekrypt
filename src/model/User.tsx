import { Schema, model, models } from 'mongoose';
import { IUser } from '@/interfaces/IUser';

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  otp: { type: String }, // hashed or plain (short-lived)
  otpExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },
  passwordHash: { type: String },
  provider: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model<IUser>('User', UserSchema);
