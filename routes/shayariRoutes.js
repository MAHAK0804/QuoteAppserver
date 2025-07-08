import express from "express";
import {
  getShayaribyCategory,
  addShayari,
  updateShayari,
  deleteShayari,
} from "../controllers/shayari.js";
// import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", getShayaribyCategory); // GET all or by ?category=
router.post("/", addShayari); // POST new
router.put("/:id", updateShayari); // PUT update
router.delete("/:id", deleteShayari); // DELETE

export default router;
