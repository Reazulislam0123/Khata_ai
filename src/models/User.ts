// src/models/User.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole = "STUDENT" | "ADMIN" | "SUPER_ADMIN";
export type SubscriptionStatus = "ACTIVE" | "PENDING_APPROVAL" | "INACTIVE" | "REJECTED";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  role: UserRole;
  institutionId?: mongoose.Types.ObjectId;
  avatarUrl?: string;
  phone?: string;
  rollNo?: string;
  batchId?: mongoose.Types.ObjectId;
  isActive: boolean;
  plan: string;
  subscriptionStatus: SubscriptionStatus;
  planRequested?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["STUDENT", "ADMIN", "SUPER_ADMIN"], default: "STUDENT" },
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", default: null },
    avatarUrl: { type: String, default: null },
    phone: { type: String, default: null },
    rollNo: { type: String, default: null },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", default: null },
    isActive: { type: Boolean, default: true },
    plan: { type: String, default: "FREE" },
    subscriptionStatus: {
      type: String,
      enum: ["ACTIVE", "PENDING_APPROVAL", "INACTIVE", "REJECTED"],
      default: "ACTIVE",
    },
    planRequested: { type: String, default: null },
  },
  { timestamps: true }
);

// Compound indexes
UserSchema.index({ institutionId: 1, role: 1 });
UserSchema.index({ institutionId: 1, batchId: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

