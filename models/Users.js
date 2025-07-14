import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  otp: String,
  otpExpires: Date,
  isVerifed: Boolean,
});

export default mongoose.model("User", userSchema);
