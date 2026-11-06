// src/models/Institution.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export type SubscriptionPlan = "FREE" | "PRO" | "ENTERPRISE";
export type InstitutionStatus = "ACTIVE" | "SUSPENDED" | "PENDING";
export type InstitutionType = "COACHING" | "SCHOOL" | "COLLEGE" | "VARSITY" | "INDIVIDUAL";

export interface IInstitution extends Document {
  name: string;
  nameBn?: string;
  slug: string;
  type: InstitutionType;
  adminUserId: mongoose.Types.ObjectId;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiry?: Date;
  status: InstitutionStatus;
  contactEmail: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  scriptsQuota: number;
  scriptsUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, default: null },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: {
      type: String,
      enum: ["COACHING", "SCHOOL", "COLLEGE", "VARSITY", "INDIVIDUAL"],
      default: "COACHING",
    },
    adminUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionPlan: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
      default: "FREE",
    },
    subscriptionExpiry: { type: Date, default: null },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "PENDING"],
      default: "ACTIVE",
    },
    contactEmail: { type: String, required: true, lowercase: true },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    logoUrl: { type: String, default: null },
    bannerUrl: { type: String, default: null },
    description: { type: String, default: null },
    scriptsQuota: { type: Number, default: 50 },
    scriptsUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

InstitutionSchema.index({ status: 1, subscriptionPlan: 1 });

const Institution: Model<IInstitution> =
  mongoose.models.Institution ||
  mongoose.model<IInstitution>("Institution", InstitutionSchema);

export default Institution;

