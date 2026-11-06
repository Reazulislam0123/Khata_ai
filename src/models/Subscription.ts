// src/models/Subscription.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IInvoice {
  invoiceId: string;
  paidAt: Date;
  amount: number;
}

export interface ISubscription extends Document {
  institutionId: mongoose.Types.ObjectId;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate: Date;
  endDate: Date;
  billingCycle: "MONTHLY" | "YEARLY";
  amount: number;
  currency: "BDT" | "USD";
  invoices: IInvoice[];
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceId: String,
    paidAt: Date,
    amount: Number,
  },
  { _id: false }
);

const SubscriptionSchema = new Schema<ISubscription>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", required: true },
    plan: { type: String, enum: ["FREE", "PRO", "ENTERPRISE"], default: "FREE" },
    status: { type: String, enum: ["ACTIVE", "EXPIRED", "CANCELLED"], default: "ACTIVE" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    billingCycle: { type: String, enum: ["MONTHLY", "YEARLY"], default: "MONTHLY" },
    amount: { type: Number, default: 0 },
    currency: { type: String, enum: ["BDT", "USD"], default: "BDT" },
    invoices: [InvoiceSchema],
  },
  { timestamps: true }
);

SubscriptionSchema.index({ institutionId: 1, status: 1 });

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;

