import express from "express";
import {
  getQuotesbyCategory,
  addQuotes,
  updateQuotes,
  deleteQuotes,
} from "../controllers/quotes.js";
// import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", getQuotesbyCategory); // GET all or by ?category=
router.post("/", addQuotes); // POST new
router.put("/:id", updateQuotes); // PUT update
router.delete("/:id", deleteQuotes); // DELETE

export default router;
