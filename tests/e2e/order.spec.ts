import { test, expect } from "@playwright/test";

test.describe("E2E Order via WhatsApp Flow", () => {
  test("adds product to cart, completes checkout, and generates order", async ({
    page,
  }) => {
    // 1. Visit homepage
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();

    // 2. Go to Catalog page
    await page.goto("/produk");
    await expect(page.locator("h1")).toContainText("Katalog Produk");

    // 3. Click first product card "+ Keranjang"
    const addButtons = page.locator("button:has-text('+ Keranjang')");
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();

    // 4. Navigate to Cart page
    await page.goto("/keranjang");
    await expect(page.locator("h1")).toContainText("Keranjang Belanja");

    // 5. Fill customer details
    await page.fill("#customerName", "E2E Tester Pembeli");
    await page.fill("#customerPhone", "081234567890");
    await page.fill("#address", "Jl. Uji Coba Playwright No. 99");

    // 6. Verify honeypot is empty
    const honeypotInput = page.locator("#hp_website");
    await expect(honeypotInput).toHaveValue("");

    // 7. Intercept window.location redirect or form submission
    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes("/keranjang") || req.method() === "POST"),
      page.click("button:has-text('Kirim Pesanan ke WhatsApp')"),
    ]);

    expect(request).toBeDefined();
  });
});
