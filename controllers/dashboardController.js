// controllers/dashboardController.js
import Category from "../models/Category.js";
import Quotes from "../models/Quotes.js";
import moment from "moment";

export const getDashboardStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const totalQuotes = await Quotes.countDocuments();
    const totalAdmins = 1; // or await Admin.countDocuments();
    console.log(totalCategories, totalAdmins, totalQuotes);

    res.json([
      { name: "Categories", count: totalCategories },
      { name: "Quotes", count: totalQuotes },
      { name: "Admins", count: totalAdmins },
    ]);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
export const getQuoteChartData = async (req, res) => {
  try {
    const categories = await Category.find();
    const data = await Promise.all(
      categories.map(async (cat) => {
        const count = await Quotes.countDocuments({ categoryId: cat._id });
        return { name: cat.title, Quotes: count };
      })
    );
    res.json(data);
  } catch (err) {
    console.error("Chart data error:", err);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
};

export const getRecentQuotes = async (req, res) => {
  try {
    const quotes = await Quotes.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("categoryId", "title");

    const formatted = quotes.map((s) => ({
      title: s.text,
      categoryTitle: s.categoryId?.title || "Unknown",
      timeAgo: moment(s.createdAt).fromNow(), // e.g. "2 hours ago"
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Recent Quotes error:", err);
    res.status(500).json({ error: "Failed to fetch recent Quotes" });
  }
};
