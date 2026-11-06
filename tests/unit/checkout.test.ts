import { describe, it, expect } from "vitest";
import { cleanPhoneNumber, generateWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatRupiah, calculateOrderTotal } from "@/lib/format";

describe("Checkout & WhatsApp Order Flow Unit Tests", () => {
  it("cleans Indonesian phone number to international 62 format", () => {
    expect(cleanPhoneNumber("081234567890")).toBe("6281234567890");
    expect(cleanPhoneNumber("+6281234567890")).toBe("6281234567890");
    expect(cleanPhoneNumber("0812-3456-7890")).toBe("6281234567890");
  });

  it("calculates multi-item order total accurately without floating point issues", () => {
    const items = [
      { unitPrice: 25000, qty: 2 }, // 50,000
      { unitPrice: 18000, qty: 3 }, // 54,000
    ];
    const total = calculateOrderTotal(items);
    expect(total).toBe(104000);
    expect(formatRupiah(total)).toBe("Rp 104.000");
  });

  it("generates a well-formatted WhatsApp message and valid wa.me URL", () => {
    const payload = {
      code: "UMK-20261106-1234",
      customerName: "Budi Santoso",
      customerPhone: "081234567890",
      address: "Jl. Mawar No. 10",
      note: "Pedas sedang",
      items: [
        {
          productName: "Pempek Kulit",
          variantName: "Paket Hemat",
          unitPrice: 45000,
          qty: 2,
        },
      ],
      total: 90000,
    };

    const message = generateWhatsAppMessage(payload);
    expect(message).toContain("PESANAN BARU - UMK-20261106-1234");
    expect(message).toContain("Nama: Budi Santoso");
    expect(message).toContain("Pempek Kulit (Paket Hemat) x2 = Rp 90.000");
    expect(message).toContain("Total Pembayaran: Rp 90.000");

    const url = buildWhatsAppUrl("081234567890", payload);
    expect(url).toContain("https://wa.me/6281234567890?text=");
    expect(url).toContain(encodeURIComponent("PESANAN BARU - UMK-20261106-1234"));
  });
});
