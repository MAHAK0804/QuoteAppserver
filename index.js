import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";

import categoryRoutes from "./routes/categoryRoutes.js";
import shayariRoutes from "./routes/shayariRoutes.js";
import adminroutes from "./routes/authroutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import usersRoutes from "./routes/userroutes.js";
import usersShayarisRoutes from "./routes/usersShayarisroutes.js";

dotenv.config();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(fileUpload());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/admin", adminroutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/shayaris", shayariRoutes);
app.use("/api/users/auth", usersRoutes);
app.use("/api/users/shayaris", usersShayarisRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
