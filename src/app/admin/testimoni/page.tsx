import { db } from "@/lib/db";
import { TestimonialManager } from "@/components/admin/testimonial-manager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Kelola Testimoni Pelanggan
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Tampilkan ulasan asli dari pelanggan untuk membangun kepercayaan calon pembeli.
        </p>
      </div>

      <TestimonialManager testimonials={testimonials} />
    </div>
  );
}
