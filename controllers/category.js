import Category from "../models/Category.js";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_KEY,
  },
});

// 📥 GET all categories
export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// ➕ ADD a new category
export const addCategory = async (req, res) => {
  try {
    const { emoji, title } = req.body;
    const file = req.files?.icon;

    let iconUrl = "";

    if (file) {
      const fileName = `icons/${uuidv4()}_${file.name}`;
      const uploadParams = {
        Bucket: process.env.MY_AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.data,
        ContentType: file.mimetype,
      };

      const uploader = new Upload({ client: s3Client, params: uploadParams });
      const result = await uploader.done();
      iconUrl = result.Location;
    }

    const newCategory = new Category({ emoji, title, iconUrl });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to add category" });
  }
};

// 🖊️ UPDATE category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji, title } = req.body;
    const file = req.files?.icon;
    let iconUrl = "";

    if (file) {
      const fileName = `icons/${uuidv4()}_${file.name}`;
      const uploadParams = {
        Bucket: process.env.MY_AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.data,
        ContentType: file.mimetype,
      };

      const uploader = new Upload({ client: s3Client, params: uploadParams });
      const result = await uploader.done();
      iconUrl = result.Location;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        emoji,
        title,
        ...(iconUrl && { iconUrl }),
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

// ❌ DELETE category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};
