const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    return cb(null, true);
  }
  cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
};

const limits = { fileSize: 5 * 1024 * 1024, files: 5 }; // 5MB per file, up to 5 files

/**
 * Storage engine selection:
 * - If CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET are set (typical in production),
 *   images upload directly to Cloudinary and req.files[i].path is a full CDN URL.
 * - Otherwise, falls back to local disk storage under backend/uploads
 *   (fine for local development; NOT durable on most hosting platforms,
 *   since their filesystems are wiped on redeploy/restart).
 */
const useCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

let storage;

if (useCloudinary) {
  const cloudinary = require("cloudinary").v2;
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "roveon-vehicles",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });

  console.log("Image uploads: using Cloudinary storage");
} else {
  const uploadDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

  console.log("Image uploads: using local disk storage (set CLOUDINARY_* env vars for production)");
}

const upload = multer({ storage, fileFilter, limits });

// Normalizes a multer file object into a public URL, regardless of which
// storage engine handled it. Use this everywhere instead of re-deriving paths.
const getFileUrl = (file) => (useCloudinary ? file.path : `/uploads/${file.filename}`);

module.exports = upload;
module.exports.getFileUrl = getFileUrl;
