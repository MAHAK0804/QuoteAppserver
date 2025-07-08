import { login, register } from "../controllers/authController.js";
import express from "express";
const router = express.Router();

// Register Admin
router.post("/register", register);

// Login Admin
router.post("/login", login);

export default router;
