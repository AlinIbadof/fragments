import mongoose, { Document } from "mongoose";

export interface IAccessSession extends Document {
  roomCode: string;
  sessionToken: string;
  createdAt: Date;
}

const accessSessionSchema = new mongoose.Schema<IAccessSession>(
  {
    roomCode: {
      type: String,
      required: true,
      index: true,
    },
    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 7,
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model<IAccessSession>(
  "AccessSession",
  accessSessionSchema,
);
