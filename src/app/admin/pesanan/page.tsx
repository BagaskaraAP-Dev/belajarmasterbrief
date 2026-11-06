import { db } from "@/lib/db";
import { OrderManager } from "@/components/admin/order-manager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Kelola Pesanan Masuk
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Pantau status pesanan pelanggan dan teruskan komunikasi melalui WhatsApp.
        </p>
      </div>

      <OrderManager orders={orders} />
    </div>
  );
}
