import Quotes from "../models/Quotes.js";

// 📥 GET all Shayaris or by Category
export const getQuotesbyCategory = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const filter = category ? { categoryId: category } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Quotes.countDocuments(filter);

    const quotes = await Quotes.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      quotes,
    });
  } catch (error) {
    console.error("Pagination Error:", error);
    res.status(500).json({ error: "Failed to fetch shayaris" });
  }
};

// ➕ ADD Shayari
export const addQuotes = async (req, res) => {
  try {
    const { text, categoryId } = req.body;
    console.log(req.body);

    if (!text || !categoryId) {
      return res.status(400).json({ error: "Text and Category are required" });
    }

    const newQuotes = new Quotes({ text, categoryId });
    await newQuotes.save();
    res.status(201).json(newQuotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to add shayari" });
  }
};

// 🖊️ UPDATE Shayari
export const updateQuotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, categoryId } = req.body;

    const updated = await Quotes.findByIdAndUpdate(
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
export const deleteQuotes = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Quotes.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Shayari not found" });
    }

    res.json({ message: "Shayari deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete shayari" });
  }
};
