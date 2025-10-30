import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ✅ Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "vednine-jwellers", // 🗂 Folder name in Cloudinary
    resource_type: "auto", // ✅ Auto-detects image/video/raw (important for avif, heic, etc.)
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
    ], // ✅ Supports all common formats
    public_id: `${Date.now()}-${file.originalname
      .split(".")[0]
      .replace(/\s+/g, "_")}`, // Clean file name
    transformation: [{ width: 800, height: 800, crop: "limit" }], // Optional resize
  }),
});

// ✅ Initialize Multer with Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size (you can increase this)
});

export default upload;
