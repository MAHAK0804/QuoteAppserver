import Shayari from "../models/Shayari.js";

// 📥 GET all Shayaris or by Category
export const getShayaribyCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { categoryId: category } : {};
    const shayaris = await Shayari.find(filter).sort({ createdAt: -1 });
    res.json(shayaris);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shayaris" });
  }
};

// ➕ ADD Shayari
export const addShayari = async (req, res) => {
  try {
    const { text, categoryId } = req.body;

    if (!text || !categoryId) {
      return res.status(400).json({ error: "Text and Category are required" });
    }

    const newShayari = new Shayari({ text, categoryId });
    await newShayari.save();
    res.status(201).json(newShayari);
  } catch (error) {
    res.status(500).json({ error: "Failed to add shayari" });
  }
};

// 🖊️ UPDATE Shayari
export const updateShayari = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, categoryId } = req.body;

    const updated = await Shayari.findByIdAndUpdate(
      id,
      { text, categoryId },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Shayari not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update shayari" });
  }
};

// ❌ DELETE Shayari
export const deleteShayari = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Shayari.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Shayari not found" });
    }

    res.json({ message: "Shayari deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete shayari" });
  }
};
