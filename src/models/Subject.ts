// src/models/Subject.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubject extends Document {
  institutionId: mongoose.Types.ObjectId;
  batchId?: mongoose.Types.ObjectId;
  name: string;
  code: string;
  teacherId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", required: true, index: true },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", default: null },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

SubjectSchema.index({ institutionId: 1, batchId: 1 });

const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;

