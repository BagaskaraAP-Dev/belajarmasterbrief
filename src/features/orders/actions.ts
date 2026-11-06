"use server";

import { db } from "@/lib/db";
import { getStoreSettings } from "@/features/settings/queries";
import { buildWhatsAppUrl, cleanPhoneNumber } from "@/lib/whatsapp";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { z } from "zod";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  customerPhone: z.string().min(9, "Nomor WhatsApp minimal 9 digit"),
  address: z.string().optional(),
  note: z.string().optional(),
  // Honeypot spam protection (must remain empty for real humans)
  hp_website: z.string().max(0, "Spam terdeteksi"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().nullable().optional(),
        qty: z.number().int().positive().max(100),
      })
    )
    .min(1, "Keranjang belanja tidak boleh kosong"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutResult = {
  success: boolean;
  error?: string;
  orderCode?: string;
  waUrl?: string;
};

export async function createOrderAction(
  input: CheckoutInput
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Data formulir tidak valid.";
    return { success: false, error: errorMsg };
  }

  // Rate Limiting per IP (Brief: Checkout publik dibatasi rate limit per IP + honeypot)
  let ip = "127.0.0.1";
  try {
    const reqHeaders = await headers();
    ip = getClientIp(reqHeaders);
  } catch {
    // Fallback if executed outside request context
  }

  const rl = rateLimit(`checkout:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.success) {
    return {
      success: false,
      error:
        "Terlalu banyak permintaan pemesanan dari perangkat Anda. Silakan tunggu beberapa saat.",
    };
  }

  const { customerName, customerPhone, address, note, items } = parsed.data;

  try {
    const settings = await getStoreSettings();

    // 1. Validate & recalculate all items from Database
    const productIds = items.map((i) => i.productId);
    const dbProducts = await db.product.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
      include: {
        variants: true,
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const validatedOrderItems: Array<{
      productId: string;
      productName: string;
      variantName: string | null;
      unitPrice: number;
      qty: number;
    }> = [];

    let totalAmount = 0;

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        return {
          success: false,
          error: "Salah satu produk tidak ditemukan atau sudah tidak tersedia.",
        };
      }

      if (!dbProduct.isAvailable) {
        return {
          success: false,
          error: `Produk "${dbProduct.name}" sedang habis stok.`,
        };
      }

      let unitPrice = dbProduct.price;
      let variantName: string | null = null;

      if (item.variantId) {
        const dbVariant = dbProduct.variants.find((v) => v.id === item.variantId);
        if (!dbVariant) {
          return {
            success: false,
            error: `Varian pada produk "${dbProduct.name}" tidak valid.`,
          };
        }
        unitPrice += dbVariant.priceDiff;
        variantName = dbVariant.name;
      }

      const itemTotal = unitPrice * item.qty;
      totalAmount += itemTotal;

      validatedOrderItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        variantName,
        unitPrice,
        qty: item.qty,
      });
    }

    // 2. Generate unique order code (UMK-YYYYMMDD-XXXX)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `UMK-${dateStr}-${randomSuffix}`;

    // 3. Create Order in Database
    const cleanPhone = cleanPhoneNumber(customerPhone);

    const createdOrder = await db.order.create({
      data: {
        code: orderCode,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        address: address?.trim() || null,
        note: note?.trim() || null,
        total: totalAmount,
        status: "BARU",
        items: {
          create: validatedOrderItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            variantName: item.variantName,
            unitPrice: item.unitPrice,
            qty: item.qty,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 4. Generate WhatsApp Message & wa.me redirect link
    const waUrl = buildWhatsAppUrl(settings.waNumber, {
      code: createdOrder.code,
      customerName: createdOrder.customerName,
      customerPhone: createdOrder.customerPhone,
      address: createdOrder.address || undefined,
      note: createdOrder.note || undefined,
      items: createdOrder.items.map((i) => ({
        productName: i.productName,
        variantName: i.variantName || undefined,
        unitPrice: i.unitPrice,
        qty: i.qty,
      })),
      total: createdOrder.total,
    });

    return {
      success: true,
      orderCode: createdOrder.code,
      waUrl,
    };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan pada sistem saat memproses pesanan.";
    return { success: false, error: errorMsg };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: "BARU" | "DIPROSES" | "SELESAI" | "BATAL"
) {
  const { requireAdmin } = await import("@/lib/auth");
  const { revalidatePath } = await import("next/cache");
  await requireAdmin();

  try {
    await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin/pesanan");
    revalidatePath("/admin");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal memperbarui status pesanan";
    return { success: false, error: errorMsg };
  }
}

export async function deleteOldOrdersAction(olderThanDays = 90) {
  const { requireAdmin } = await import("@/lib/auth");
  const { revalidatePath } = await import("next/cache");
  await requireAdmin();

  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - olderThanDays);

    const deleted = await db.order.deleteMany({
      where: {
        createdAt: { lt: thresholdDate },
      },
    });

    revalidatePath("/admin/pesanan");
    return { success: true, count: deleted.count };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal menghapus pesanan lawas";
    return { success: false, error: errorMsg };
  }
}

