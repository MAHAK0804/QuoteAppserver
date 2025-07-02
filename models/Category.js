import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  emoji: String,
  title: String,
  iconUrl: String, // S3 icon URL
});

export default mongoose.model("Category", categorySchema);
