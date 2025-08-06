import express from "express";
import Users from "../models/Users.js";
import UserQuotes from "../models/UserQuotes.js";

const router = express.Router();

// Post Shayari
router.post("/add", async (req, res) => {
  const { userId, text } = req.body;

  const user = await Users.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerifed) {
    const shayari = new UserQuotes({ userId, text });
    await shayari.save();
    res.json({ message: "Shayari added", shayari });
  } else {
    res.status(500).json({ message: "User not Verified" });
  }
});

// Get All Shayaris
router.get("/all", async (req, res) => {
  const shayaris = await UserQuotes.find()
    .populate("userId", "email phone")
    .sort({ createdAt: -1 });
  res.json(shayaris);
});
// Update Shayari by userId and shayariId
router.put("/update/:shayariId", async (req, res) => {
  const { shayariId } = req.params;
  const { userId, text } = req.body;

  try {
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerifed)
      return res.status(403).json({ message: "User not verified" });

    const shayari = await UserQuotes.findOneAndUpdate(
      { _id: shayariId, userId },
      { text },
      { new: true }
    );

    if (!shayari) {
      return res
        .status(404)
        .json({ message: "Shayari not found or not owned by user" });
    }

    res.json({ message: "Shayari updated successfully", shayari });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

export default router;
