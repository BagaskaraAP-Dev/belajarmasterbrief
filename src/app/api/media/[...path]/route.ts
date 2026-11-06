import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const UPLOADS_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

// Supported MIME types
const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path || [];

  // Reject path traversal attempts immediately
  for (const segment of pathSegments) {
    if (segment === ".." || segment.includes("/") || segment.includes("\\")) {
      return new NextResponse("Forbidden: Akses ditolak", { status: 403 });
    }
  }

  const requestedFile = path.join(UPLOADS_DIR, ...pathSegments);
  const resolvedPath = path.resolve(requestedFile);
  const resolvedUploadsDir = path.resolve(UPLOADS_DIR);

  // Strict check: file must reside strictly inside UPLOADS_DIR
  if (!resolvedPath.startsWith(resolvedUploadsDir)) {
    return new NextResponse("Forbidden: Akses ditolak", { status: 403 });
  }

  if (!fs.existsSync(resolvedPath)) {
    return new NextResponse("Not Found: Berkas tidak ditemukan", { status: 404 });
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  try {
    const fileBuffer = fs.readFileSync(resolvedPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
