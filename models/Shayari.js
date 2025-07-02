import mongoose from "mongoose";

const shayariSchema = new mongoose.Schema({
  text: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

export default mongoose.model("Shayari", shayariSchema);
