// routes/dashboardRoutes.js
import express from "express";
import {
  getDashboardStats,
  getShayariChartData,
  getRecentShayaris,
} from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/chart", getShayariChartData);
router.get("/recent-shayaris", getRecentShayaris);

export default router;
