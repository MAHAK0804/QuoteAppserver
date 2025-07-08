// routes/dashboardRoutes.js
import express from "express";
import {
  getDashboardStats,
  getShayariChartData,
  getRecentShayaris,
} from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);
router.get("/chart", verifyToken, getShayariChartData);
router.get("/recent-shayaris", verifyToken, getRecentShayaris);

export default router;
