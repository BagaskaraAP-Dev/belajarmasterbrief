import { describe, it, expect } from "vitest";
import { formatRupiah, calculateItemTotal, calculateOrderTotal } from "@/lib/format";

describe("Format & Logika Harga", () => {
  it("memformat rupiah dengan tepat tanpa desimal", () => {
    expect(formatRupiah(25000)).toBe("Rp 25.000");
    expect(formatRupiah(0)).toBe("Rp 0");
    expect(formatRupiah(1500000)).toBe("Rp 1.500.000");
  });

  it("menghitung subtotal item dengan benar", () => {
    expect(calculateItemTotal(15000, 3)).toBe(45000);
    expect(calculateItemTotal(15000, 0)).toBe(0);
    expect(calculateItemTotal(-100, 2)).toBe(0);
  });

  it("menghitung total order dengan benar", () => {
    const items = [
      { unitPrice: 20000, qty: 2 },
      { unitPrice: 15000, qty: 1 },
    ];
    expect(calculateOrderTotal(items)).toBe(55000);
  });
});
