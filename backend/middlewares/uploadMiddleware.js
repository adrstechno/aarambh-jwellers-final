// backend/middleware/uploadMiddleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/* ============================================================
   🖼 IMAGE UPLOAD (Existing Setup)
============================================================ */
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "vednine-jwellers/products",
    resource_type: "image",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "avif",
      "heic",
      "svg",
      "tiff",
      "bmp",
    ],
    public_id: `${Date.now()}-${file.originalname
      .split(".")[0]
      .replace(/\s+/g, "_")}`,
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  }),
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const uploadSingle = imageUpload.single("image");
export const uploadMultiple = imageUpload.array("images", 10);

/* ============================================================
   🎥 VIDEO UPLOAD (for Reels)
============================================================ */
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "vednine-jwellers/reels",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "mkv", "webm"],
    public_id: `${Date.now()}-${file.originalname
      .split(".")[0]
      .replace(/\s+/g, "_")}`,
  }),
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 200 * 1024 * 1024 }, // Max 200MB for videos
});

export const uploadVideoSingle = videoUpload.single("video"); // ✅ for reels

export default imageUpload;
