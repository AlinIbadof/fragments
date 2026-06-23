import mongoose, { Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  roomCode: string;
  pinHash: string;

  createdAt: Date;
  expiresAt: Date;

  isActive: boolean;
}

const eventSchema = new mongoose.Schema<IEvent>({
  title: {
    type: String,
    required: true,
  },

  roomCode: {
    type: String,
    required: true,
    unique: true,
  },

  pinHash: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model<IEvent>("Event", eventSchema);
