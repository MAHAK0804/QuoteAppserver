// controllers/dashboardController.js
import Category from "../models/Category.js";
import Shayari from "../models/Shayari.js";
import moment from "moment";

export const getDashboardStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const totalShayaris = await Shayari.countDocuments();
    const totalAdmins = 1; // or await Admin.countDocuments();

    res.json([
      { name: "Categories", count: totalCategories },
      { name: "Shayaris", count: totalShayaris },
      { name: "Admins", count: totalAdmins },
    ]);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
export const getShayariChartData = async (req, res) => {
  try {
    const categories = await Category.find();
    const data = await Promise.all(
      categories.map(async (cat) => {
        const count = await Shayari.countDocuments({ categoryId: cat._id });
        return { name: cat.title, shayaris: count };
      })
    );
    res.json(data);
  } catch (err) {
    console.error("Chart data error:", err);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
};

export const getRecentShayaris = async (req, res) => {
  try {
    const shayaris = await Shayari.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("categoryId", "title");

    const formatted = shayaris.map((s) => ({
      title: s.text,
      categoryTitle: s.categoryId?.title || "Unknown",
      timeAgo: moment(s.createdAt).fromNow(), // e.g. "2 hours ago"
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Recent shayaris error:", err);
    res.status(500).json({ error: "Failed to fetch recent shayaris" });
  }
};
