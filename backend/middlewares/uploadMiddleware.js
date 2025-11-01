import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ✅ Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "vednine-jwellers/products", // 🗂 Organized Cloudinary folder
    resource_type: "auto", // Supports all image formats
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
    transformation: [{ width: 800, height: 800, crop: "limit" }], // Optimize image
  }),
});

// ✅ Initialize Multer with Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
});

// ✅ Export ready-to-use middlewares
export const uploadSingle = upload.single("image"); // Single image (for banner, category, etc.)
export const uploadMultiple = upload.array("images", 10); // Multiple images (for product gallery)
export default upload;
