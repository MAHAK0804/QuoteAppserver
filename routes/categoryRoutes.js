import express from "express";
import {
  getAllCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllCategory);
router.post("/", verifyToken, addCategory);
router.put("/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);

export default router;
