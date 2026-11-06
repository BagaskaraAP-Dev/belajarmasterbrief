import { test, expect } from "@playwright/test";

test("halaman health endpoint merespon 200 OK", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.status).toBe("ok");
  expect(data.service).toBe("umkm-website");
});

test("halaman beranda tampil dengan status fondasi aktif", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("[ISI_NAMA_USAHA]");
});
