import { describe, it, expect } from "vitest";
import {
  cleanPhoneNumber,
  generateWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";

describe("Pesan WhatsApp", () => {
  it("membersihkan nomor HP ke format internasional tanpa plus", () => {
    expect(cleanPhoneNumber("081234567890")).toBe("6281234567890");
    expect(cleanPhoneNumber("+6281234567890")).toBe("6281234567890");
    expect(cleanPhoneNumber("62812-3456-7890")).toBe("6281234567890");
  });

  it("menghasilkan teks pesan WhatsApp dengan format yang rapi", () => {
    const payload = {
      code: "UMK-20261106-0001",
      customerName: "Budi",
      customerPhone: "081299998888",
      address: "Jl. Anggrek No. 5",
      note: "Pedas sedang",
      total: 50000,
      items: [
        {
          productName: "Pempek Kapal Selam",
          variantName: "Pedas",
          qty: 2,
          unitPrice: 25000,
        },
      ],
    };

    const msg = generateWhatsAppMessage(payload);
    expect(msg).toContain("UMK-20261106-0001");
    expect(msg).toContain("Budi");
    expect(msg).toContain("Jl. Anggrek No. 5");
    expect(msg).toContain("Pempek Kapal Selam (Pedas) x2 = Rp 50.000");
    expect(msg).toContain("Total Pembayaran: Rp 50.000");
  });

  it("membangun URL wa.me yang valid dan ter-encode", () => {
    const payload = {
      code: "UMK-20261106-0002",
      customerName: "Siti",
      customerPhone: "081211112222",
      total: 20000,
      items: [
        {
          productName: "Kemplang Panggang",
          qty: 1,
          unitPrice: 20000,
        },
      ],
    };

    const url = buildWhatsAppUrl("081234567890", payload);
    expect(url.startsWith("https://wa.me/6281234567890?text=")).toBe(true);
    expect(url).toContain(encodeURIComponent("UMK-20261106-0002"));
    expect(url).toContain(encodeURIComponent("Siti"));
  });
});
