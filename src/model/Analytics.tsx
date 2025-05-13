import { Schema, model, models } from "mongoose";
import { IAnalytics } from "@/interfaces/IAnalytics";

const AnalyticsSchema = new Schema<IAnalytics>({
  linkId: { type: Schema.Types.ObjectId, ref: "Link", required: true },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  country: { type: String },
  browser: { type: String },
  os: { type: String },
});

export const Analytics =
  models.Analytics || model<IAnalytics>("Analytics", AnalyticsSchema);
