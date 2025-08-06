// routes/dashboardRoutes.js
import express from "express";
import {
  getDashboardStats,
  getQuoteChartData,
  getRecentQuotes,
} from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/chart", getQuoteChartData);
router.get("/recent-quotes", getRecentQuotes);

export default router;
