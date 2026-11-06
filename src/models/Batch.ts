// src/models/Batch.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBatch extends Document {
  institutionId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  curriculumCode: string;
  subjectIds: mongoose.Types.ObjectId[];
  enrolledStudentCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    curriculumCode: { type: String, required: true, default: "HSC" },
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    enrolledStudentCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BatchSchema.index({ institutionId: 1, isActive: 1 });

const Batch: Model<IBatch> =
  mongoose.models.Batch || mongoose.model<IBatch>("Batch", BatchSchema);

export default Batch;

