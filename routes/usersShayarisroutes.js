import express from "express";
import Users from "../models/Users.js";
import UsersShayari from "../models/UsersShayari.js";

const router = express.Router();

// Post Shayari
router.post("/add", async (req, res) => {
  const { userId, text } = req.body;

  const user = await Users.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerifed) {
    const shayari = new UsersShayari({ userId, text });
    await shayari.save();
    res.json({ message: "Shayari added", shayari });
  } else {
    res.status(500).json({ message: "User not Verified" });
  }
});

// Get All Shayaris
router.get("/all", async (req, res) => {
  const shayaris = await UsersShayari.find()
    .populate("userId", "email phone")
    .sort({ createdAt: -1 });
  res.json(shayaris);
});

export default router;
