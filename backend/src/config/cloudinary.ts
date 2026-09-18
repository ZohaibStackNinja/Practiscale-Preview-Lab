import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { ENV } from "./env.js";

const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const isCloudinaryConfigured = Boolean(
  ENV.CLOUDINARY_CLOUD_NAME &&
  ENV.CLOUDINARY_API_KEY &&
  ENV.CLOUDINARY_API_SECRET,
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log(
    "[Cloudinary] Configured with cloud name:",
    ENV.CLOUDINARY_CLOUD_NAME,
  );
} else {
  console.log(
    "[Storage] Cloudinary credentials not detected; using local storage in ./uploads folder",
  );
}

export interface UploadResult {
  provider: "cloudinary" | "local";
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  bytes?: number;
  mimeType?: string;
}

export async function uploadImageFile(
  filePath: string,
  originalFilename: string,
  mimeType: string,
  fileSize: number,
  hostUrl: string,
): Promise<UploadResult> {
  if (isCloudinaryConfigured) {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: "practiscale_previewlab",
      resource_type: "image",
    });
    // Remove temporary file after upload to Cloudinary
    try {
      fs.unlinkSync(filePath);
    } catch {
      // ignore
    }
    return {
      provider: "cloudinary",
      publicId: res.public_id,
      secureUrl: res.secure_url,
      width: res.width,
      height: res.height,
      bytes: res.bytes,
      mimeType: res.format ? `image/${res.format}` : mimeType,
    };
  }

  // Local storage fallback
  const filename = path.basename(filePath);
  const secureUrl = `${hostUrl}/uploads/${filename}`;
  return {
    provider: "local",
    publicId: filename,
    secureUrl,
    bytes: fileSize,
    mimeType,
  };
}
