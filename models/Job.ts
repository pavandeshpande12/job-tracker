import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  userEmail: string;          // who this job belongs to
  company: string;
  role: string;
  status: string;             // Applied, Interview, Offer, Rejected etc.
  appliedDate: Date;
  notes?: string;
}

const JobSchema: Schema<IJob> = new Schema(
  {
    userEmail: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Online Test", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    appliedDate: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;
