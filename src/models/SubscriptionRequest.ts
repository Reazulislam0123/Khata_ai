// src/models/SubscriptionRequest.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export type SubscriptionRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ISubscriptionRequest extends Document {
  userId?: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userRole: "STUDENT" | "ADMIN" | "TEACHER";
  institutionName?: string;
  planId: string;
  planName: string;
  amount: number;
  currency: "BDT" | "USD";
  billingCycle: string;
  paymentMethod: "bkash" | "nagad" | "card" | "bank" | "direct";
  paymentPhone?: string;
  transactionId?: string;
  status: SubscriptionRequestStatus;
  adminNotes?: string;
  approvedAt?: Date;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionRequestSchema = new Schema<ISubscriptionRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    userRole: { type: String, enum: ["STUDENT", "ADMIN", "TEACHER"], default: "TEACHER" },
    institutionName: { type: String, default: null },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, enum: ["BDT", "USD"], default: "BDT" },
    billingCycle: { type: String, default: "monthly" },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "card", "bank", "direct"],
      default: "bkash",
    },
    paymentPhone: { type: String, default: null },
    transactionId: { type: String, default: null },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    adminNotes: { type: String, default: null },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: String, default: null },
  },
  { timestamps: true }
);

SubscriptionRequestSchema.index({ status: 1, createdAt: -1 });

const SubscriptionRequest: Model<ISubscriptionRequest> =
  mongoose.models.SubscriptionRequest ||
  mongoose.model<ISubscriptionRequest>("SubscriptionRequest", SubscriptionRequestSchema);

export default SubscriptionRequest;

