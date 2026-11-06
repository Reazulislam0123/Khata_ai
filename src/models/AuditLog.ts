// src/models/AuditLog.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAuditLog extends Document {
  actorId: mongoose.Types.ObjectId;
  actorRole: string;
  action: string;
  targetCollection?: string;
  targetId?: mongoose.Types.ObjectId;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true },
    targetCollection: { type: String, default: null },
    targetId: { type: Schema.Types.ObjectId, default: null },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: null },
  },
  { timestamps: true }
);

AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ createdAt: -1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;

