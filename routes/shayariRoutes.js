import express from "express";
import Shayari from "../models/Shayari.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { categoryId: category } : {};
    const shayaris = await Shayari.find(filter);
    res.json(shayaris);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shayaris" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { text, categoryId } = req.body;
    const shayari = new Shayari({ text, categoryId });
    await shayari.save();
    res.status(201).json(shayari);
  } catch (error) {
    res.status(500).json({ error: "Failed to add shayari" });
  }
});
export default router;
