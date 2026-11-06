import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "umkm-website",
    timestamp: new Date().toISOString(),
  });
}
