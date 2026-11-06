import "server-only";
import { db } from "@/lib/db";

export async function getVisibleTestimonials() {
  try {
    return await db.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch {
    return [];
  }
}
