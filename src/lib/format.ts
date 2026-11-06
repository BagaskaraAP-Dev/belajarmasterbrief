/**
 * Utility formater mata uang dan tanggal sesuai Master Brief:
 * - Intl locale id-ID
 * - Format rupiah tanpa desimal (mis. "Rp 25.000")
 * - Zona waktu Asia/Jakarta
 */

export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rp 0";
  }
  // Standard format: "Rp 25.000"
  const formattedNumber = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);

  return `Rp ${formattedNumber}`;
}

export function formatDate(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function calculateItemTotal(unitPrice: number, qty: number): number {
  if (qty < 0 || unitPrice < 0) return 0;
  return unitPrice * qty;
}

export function calculateOrderTotal(items: Array<{ unitPrice: number; qty: number }>): number {
  return items.reduce((acc, item) => acc + calculateItemTotal(item.unitPrice, item.qty), 0);
}
