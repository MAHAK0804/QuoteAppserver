import express from "express";
import {
  getShayaribyCategory,
  addShayari,
  updateShayari,
  deleteShayari,
} from "../controllers/shayari.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getShayaribyCategory); // GET all or by ?category=
router.post("/", verifyToken, addShayari); // POST new
router.put("/:id", verifyToken, updateShayari); // PUT update
router.delete("/:id", verifyToken, deleteShayari); // DELETE

export default router;
