import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    text: String,
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quotes", quoteSchema);
