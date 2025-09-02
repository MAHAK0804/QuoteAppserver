import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  //   key: { type: String, required: true }, // S3 object key
  url: { type: String, required: true }, // S3 public URL
  createdAt: { type: Date, default: Date.now },
});

export const Explore = mongoose.model("Image", imageSchema);
