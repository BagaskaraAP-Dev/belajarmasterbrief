import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const UPLOADS_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const MAX_UPLOAD_MB = parseInt(process.env.UPLOAD_MAX_MB || "5", 10) || 5;
const MAX_FILE_SIZE = MAX_UPLOAD_MB * 1024 * 1024;

// Magic bytes checks
function isValidMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (isJpeg) return true;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  if (isPng) return true;

  // WebP: RIFF ... WEBP
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;
  if (isRiff && isWebp) return true;

  return false;
}

export type UploadedImage = {
  path: string;
  width: number;
  height: number;
  size: number;
};

export async function processAndSaveImage(
  fileBuffer: Buffer
): Promise<UploadedImage> {
  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw new Error(`Ukuran gambar melebihi batas maksimal ${MAX_UPLOAD_MB} MB`);
  }

  if (!isValidMagicBytes(fileBuffer)) {
    throw new Error("Format berkas tidak valid. Hanya menerima JPEG, PNG, atau WebP.");
  }

  // Ensure uploads directory exists
  if (!fs.existsSync(/*turbopackIgnore: true*/ UPLOADS_DIR)) {
    fs.mkdirSync(/*turbopackIgnore: true*/ UPLOADS_DIR, { recursive: true });
  }

  // Process image with sharp: strips EXIF/GPS, re-encodes to clean WebP
  const randomName = `${crypto.randomUUID()}.webp`;
  const targetFilePath = path.join(UPLOADS_DIR, randomName);

  const imagePipeline = sharp(fileBuffer)
    .rotate() // Auto-orient based on EXIF before stripping
    .webp({ quality: 85, effort: 4 });

  const metadata = await imagePipeline.metadata();
  const info = await imagePipeline.toFile(targetFilePath);

  return {
    path: `/api/media/${randomName}`,
    width: info.width || metadata.width || 800,
    height: info.height || metadata.height || 800,
    size: info.size,
  };
}
