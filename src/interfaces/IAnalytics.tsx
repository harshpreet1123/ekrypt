import { Types } from "mongoose";

export interface IAnalytics {
  linkId: Types.ObjectId;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  browser?: string;
  os?: string;
}
