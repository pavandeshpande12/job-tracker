import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobFeedback {
  whatWentWell?: string;
  whatDidntGoWell?: string;
  lessonsLearned?: string;
}

export interface IJob extends Document {
  userEmail: string;
  company: string;
  role: string;
  status: string;
  appliedDate?: Date;
  rejectedDate?: Date;
  notes?: string;
  interviewExperience?: string;
  feedback?: IJobFeedback;
}

const JobSchema: Schema<IJob> = new Schema(
  {
    userEmail: { type: String, required: true, index: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Online Test", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    appliedDate: { type: Date },
    rejectedDate: { type: Date },
    notes: { type: String },
    interviewExperience: { type: String },
    feedback: {
      whatWentWell: { type: String },
      whatDidntGoWell: { type: String },
      lessonsLearned: { type: String },
    },
  },
  { timestamps: true }
);

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;
