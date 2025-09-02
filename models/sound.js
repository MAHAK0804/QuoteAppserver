import mongoose from "mongoose";

const soundSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true }, // S3 audio URL
    key: { type: String, required: true }, // S3 audio key
    image: { type: String, required: true }, // S3 image URL
    imageKey: { type: String, required: true }, // S3 image key
  },
  { timestamps: true }
);

export const Sound = mongoose.model("Sound", soundSchema);
