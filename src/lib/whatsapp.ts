import { formatRupiah } from "./format";

export interface OrderWhatsAppPayload {
  code: string;
  customerName: string;
  customerPhone: string;
  address?: string | null;
  note?: string | null;
  total: number;
  items: Array<{
    productName: string;
    variantName?: string | null;
    qty: number;
    unitPrice: number;
  }>;
}

export function cleanPhoneNumber(phone: string): string {
  // Hanya ambil digit
  let cleaned = phone.replace(/\D/g, "");
  // Jika diawali 08, ubah ke 628
  if (cleaned.startsWith("08")) {
    cleaned = "628" + cleaned.slice(2);
  }
  // Jika diawali +62, tanda plus sudah dibuang jadi 62
  return cleaned;
}

export function generateWhatsAppMessage(order: OrderWhatsAppPayload): string {
  const lines: string[] = [];
  lines.push(`*PESANAN BARU - ${order.code}*`);
  lines.push("--------------------------------");
  lines.push(`Nama: ${order.customerName}`);
  lines.push(`No. HP: ${order.customerPhone}`);
  if (order.address && order.address.trim()) {
    lines.push(`Alamat: ${order.address.trim()}`);
  }
  if (order.note && order.note.trim()) {
    lines.push(`Catatan: ${order.note.trim()}`);
  }
  lines.push("--------------------------------");
  lines.push("*Daftar Pesanan:*");

  order.items.forEach((item, idx) => {
    const variant = item.variantName ? ` (${item.variantName})` : "";
    const itemSubtotal = item.unitPrice * item.qty;
    lines.push(
      `${idx + 1}. ${item.productName}${variant} x${item.qty} = ${formatRupiah(itemSubtotal)}`
    );
  });

  lines.push("--------------------------------");
  lines.push(`*Total Pembayaran: ${formatRupiah(order.total)}*`);
  lines.push("");
  lines.push("Mohon konfirmasi ketersediaan dan ongkos kirim. Terima kasih!");

  return lines.join("\n");
}

export function buildWhatsAppUrl(
  phone: string,
  order: OrderWhatsAppPayload
): string {
  const cleanedPhone = cleanPhoneNumber(phone);
  const message = generateWhatsAppMessage(order);
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
}
