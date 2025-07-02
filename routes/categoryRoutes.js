import express from "express";
import Category from "../models/Category.js";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

console.log("AWS_ACCESS_KEY:", process.env.AWS_ACCESS_KEY);
console.log("MONGO_URI:", process.env.MONGO_URI);

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { emoji, title } = req.body;
    console.log("emoji", emoji); // This log should now work if Postman is configured correctly.

    const file = req.files?.icon;

    let iconUrl = "";
    if (file) {
      const fileName = `icons/${uuidv4()}_${file.name}`;
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.data,
        // Removed ACL: "public-read" as the bucket does not allow ACLs.
        // Public access should be configured via a Bucket Policy on S3.
        ContentType: file.mimetype,
      };

      const uploader = new Upload({
        client: s3Client,
        params: uploadParams,
      });

      const result = await uploader.done();
      iconUrl = result.Location;
    }

    const category = new Category({ emoji, title, iconUrl });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Failed to add category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
});

export default router;
