import express from "express";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import { Explore } from "../models/explore.js";

const router = express.Router();

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_KEY,
  },
});

// ✅ Upload image
router.post("/", async (req, res) => {
  try {
    const file = req.files?.image;
    if (!file) return res.status(400).json({ error: "No image provided" });

    const fileName = `explore/${uuidv4()}_${file.name}`;
    const uploadParams = {
      Bucket: process.env.MY_AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.data,
      ContentType: file.mimetype,
    };

    const uploader = new Upload({ client: s3Client, params: uploadParams });
    const result = await uploader.done();

    const newImage = new Explore({
      url: result.Location,
      key: fileName, // store key for easy delete/update
    });
    await newImage.save();

    res.json(newImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all images
router.get("/", async (req, res) => {
  try {
    const images = await Explore.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete image
router.delete("/:id", async (req, res) => {
  try {
    const image = await Explore.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (image.key) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.MY_AWS_BUCKET_NAME,
          Key: image.key,
        })
      );
    }

    await image.deleteOne();
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update/Replace image
router.put("/:id", async (req, res) => {
  try {
    const file = req.files?.image;
    if (!file) return res.status(400).json({ error: "No image provided" });

    const oldImage = await Explore.findById(req.params.id);
    if (!oldImage) return res.status(404).json({ error: "Image not found" });

    // Delete old from S3
    if (oldImage.key) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.MY_AWS_BUCKET_NAME,
          Key: oldImage.key,
        })
      );
    }

    // Upload new image
    const fileName = `explore/${uuidv4()}_${file.name}`;
    const uploadParams = {
      Bucket: process.env.MY_AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.data,
      ContentType: file.mimetype,
    };

    const uploader = new Upload({ client: s3Client, params: uploadParams });
    const result = await uploader.done();

    // Update record
    oldImage.url = result.Location;
    oldImage.key = fileName;
    await oldImage.save();

    res.json(oldImage);
  } catch (error) {
    res.status(500).json({ error: "Failed to update explore" });
  }
});

export default router;
