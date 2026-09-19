import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "5000",
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/practiscale_previewlab",
  FRONTEND_URL:
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "https://practiscale-preview.vercel.app",
  SHARE_TOKEN_SECRET:
    process.env.SHARE_TOKEN_SECRET ||
    "practiscale_previewlab_secret_token_key_2026",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
};
