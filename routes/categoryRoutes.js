import express from "express";
import {
  getAllCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
// import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", getAllCategory);
router.post("/", addCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
