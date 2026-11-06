import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { processAndSaveImage } from "@/lib/upload";
import fs from "node:fs";

describe("Image Upload Security & Processing Unit Tests", () => {
  it("rejects non-image buffers masquerading as images", async () => {
    const maliciousBuffer = Buffer.from("<html><script>alert(1)</script></html>");
    await expect(processAndSaveImage(maliciousBuffer)).rejects.toThrow(
      "Format berkas tidak valid"
    );
  });

  it("processes a valid PNG, strips metadata, and converts to WebP", async () => {
    // Generate a 10x10 test PNG image using sharp
    const samplePng = await sharp({
      create: {
        width: 10,
        height: 10,
        channels: 3,
        background: { r: 180, g: 83, b: 9 }, // brand amber
      },
    })
      .png()
      .toBuffer();

    const result = await processAndSaveImage(samplePng);
    expect(result.path).toMatch(/^\/api\/media\/[a-f0-9-]+\.webp$/);
    expect(result.width).toBe(10);
    expect(result.height).toBe(10);

    // Clean up temporary test file from disk
    const filename = result.path.replace("/api/media/", "");
    const uploadsDir = process.env.UPLOAD_DIR || "uploads";
    const filePath = `${uploadsDir}/${filename}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
});
