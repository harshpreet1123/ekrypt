// interfaces/ILink.ts
import { Types } from "mongoose";
import { IAnalytics } from "./IAnalytics";

export interface ILink {
  originalUrl: string;
  shortCode: string;
  expiresAt?: Date | null;
  ttlMinutes?: number | null;
  maxClicks?: number | null;
  clickCount: number;
  oneTimeOnly?: boolean;
  passwordHash?: string | null;
  userId?: Types.ObjectId | null;
  analytics?: IAnalytics[];
  createdAt: Date;
}
