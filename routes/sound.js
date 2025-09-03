import express from "express";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import { Sound } from "../models/sound.js";

const router = express.Router();

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_KEY,
  },
});

// ✅ Upload sound + image
router.post("/", async (req, res) => {
  try {
    const { title, image: imageUrl } = req.body; // imageUrl can be a string URL
    const soundFile = req.files?.sound;
    const imageFile = req.files?.image;

    if (!title || !soundFile) {
      return res.status(400).json({ error: "Title and sound are required" });
    }

    // ✅ Upload sound to S3
    const soundFileName = `sounds/${uuidv4()}_${soundFile.name}`;
    const soundUploader = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.MY_AWS_BUCKET_NAME,
        Key: soundFileName,
        Body: soundFile.data,
        ContentType: soundFile.mimetype,
      },
    });
    const soundResult = await soundUploader.done();

    let finalImageUrl = "";
    let imageKey = "";

    // ✅ Check if image is a file or URL
    if (imageFile) {
      // Upload image to S3
      const imageFileName = `sounds/images/${uuidv4()}_${imageFile.name}`;
      const imageUploader = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.MY_AWS_BUCKET_NAME,
          Key: imageFileName,
          Body: imageFile.data,
          ContentType: imageFile.mimetype,
        },
      });
      const imageResult = await imageUploader.done();
      finalImageUrl = imageResult.Location;
      imageKey = imageFileName;
    } else if (imageUrl) {
      finalImageUrl =
        "https://shayaripoetry.s3.ap-south-1.amazonaws.com/sounds/images/common+sound+image.svg";
      imageKey = "url";
    }

    const newSound = new Sound({
      title,
      url: soundResult.Location,
      key: soundFileName,
      image: finalImageUrl,
      imageKey: imageKey,
    });

    await newSound.save();
    res.json(newSound);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all sounds
router.get("/", async (req, res) => {
  try {
    const sounds = await Sound.find().sort({ createdAt: -1 });
    res.json(sounds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete sound
router.delete("/:id", async (req, res) => {
  try {
    const sound = await Sound.findById(req.params.id);
    if (!sound) return res.status(404).json({ error: "Sound not found" });

    // Delete sound file
    if (sound.key) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.MY_AWS_BUCKET_NAME,
          Key: sound.key,
        })
      );
    }

    // Delete image file
    if (sound.imageKey) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.MY_AWS_BUCKET_NAME,
          Key: sound.imageKey,
        })
      );
    }

    await sound.deleteOne();
    res.json({ message: "Sound deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update sound (replace audio & image)
router.put("/:id", async (req, res) => {
  try {
    const { title } = req.body;
    const soundFile = req.files?.sound;
    const imageFile = req.files?.image;

    const soundDoc = await Sound.findById(req.params.id);
    if (!soundDoc) return res.status(404).json({ error: "Sound not found" });

    // Replace sound if new one uploaded
    if (soundFile) {
      if (soundDoc.key) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.MY_AWS_BUCKET_NAME,
            Key: soundDoc.key,
          })
        );
      }

      const soundFileName = `sounds/${uuidv4()}_${soundFile.name}`;
      const soundUploader = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.MY_AWS_BUCKET_NAME,
          Key: soundFileName,
          Body: soundFile.data,
          ContentType: soundFile.mimetype,
        },
      });
      const soundResult = await soundUploader.done();
      soundDoc.url = soundResult.Location;
      soundDoc.key = soundFileName;
    }

    // Replace image if new one uploaded
    if (imageFile) {
      if (soundDoc.imageKey) {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.MY_AWS_BUCKET_NAME,
            Key: soundDoc.imageKey,
          })
        );
      }

      const imageFileName = `sounds/images/${uuidv4()}_${imageFile.name}`;
      const imageUploader = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.MY_AWS_BUCKET_NAME,
          Key: imageFileName,
          Body: imageFile.data,
          ContentType: imageFile.mimetype,
        },
      });
      const imageResult = await imageUploader.done();
      soundDoc.image = imageResult.Location;
      soundDoc.imageKey = imageFileName;
    }

    if (title) soundDoc.title = title;

    await soundDoc.save();
    res.json(soundDoc);
  } catch (error) {
    res.status(500).json({ error: "Failed to update sound" });
  }
});

export default router;
