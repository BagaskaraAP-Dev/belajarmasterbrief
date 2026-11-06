import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Store Settings (Single row id = 1)
  const storeSetting = await prisma.storeSetting.upsert({
    where: { id: 1 },
    update: {
      name: "[ISI] Toko Berkah UMKM",
      tagline: "[ISI] Cita Rasa Asli Pilihan Keluarga Indonesia",
      logoUrl: null,
      address: "[ISI] Jl. Merdeka No. 123, Kelurahan, Kecamatan, Kota Palembang, Sumatera Selatan",
      mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127504.42854974246!2d104.692923!3d-2.990934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75e8e3d83333%3A0x3039d80b220cc80!2sPalembang!5e0!3m2!1sid!2sid!4v1600000000000!5m2!1sid!2sid",
      waNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890",
      openHours: "[ISI] Setiap Hari: 08.00 - 21.00 WIB",
      socials: {
        instagram: "https://instagram.com/[ISI]",
        tiktok: "https://tiktok.com/@[ISI]",
        facebook: "https://facebook.com/[ISI]",
        shopee: "https://shopee.co.id/[ISI]",
        tokopedia: "https://tokopedia.com/[ISI]",
      },
      heroTitle: "[ISI] Nikmati Kelezatan Kuliner Khas Berkualitas",
      heroText: "[ISI] Dibuat dengan bahan baku segar pilihan dan resep istimewa turun-temurun untuk kepuasan pelanggan setia kami.",
    },
    create: {
      id: 1,
      name: "[ISI] Toko Berkah UMKM",
      tagline: "[ISI] Cita Rasa Asli Pilihan Keluarga Indonesia",
      logoUrl: null,
      address: "[ISI] Jl. Merdeka No. 123, Kelurahan, Kecamatan, Kota Palembang, Sumatera Selatan",
      mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127504.42854974246!2d104.692923!3d-2.990934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75e8e3d83333%3A0x3039d80b220cc80!2sPalembang!5e0!3m2!1sid!2sid!4v1600000000000!5m2!1sid!2sid",
      waNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890",
      openHours: "[ISI] Setiap Hari: 08.00 - 21.00 WIB",
      socials: {
        instagram: "https://instagram.com/[ISI]",
        tiktok: "https://tiktok.com/@[ISI]",
        facebook: "https://facebook.com/[ISI]",
        shopee: "https://shopee.co.id/[ISI]",
        tokopedia: "https://tokopedia.com/[ISI]",
      },
      heroTitle: "[ISI] Nikmati Kelezatan Kuliner Khas Berkualitas",
      heroText: "[ISI] Dibuat dengan bahan baku segar pilihan dan resep istimewa turun-temurun untuk kepuasan pelanggan setia kami.",
    },
  });
  console.log(`✓ Store setting seeded: ${storeSetting.name}`);

  // 2. Categories (3 Categories)
  const categoriesData = [
    {
      id: "cat-camilan-isi",
      name: "[ISI] Camilan Khas",
      slug: "camilan-khas-isi",
      sort: 1,
    },
    {
      id: "cat-makanan-isi",
      name: "[ISI] Makanan Utama",
      slug: "makanan-utama-isi",
      sort: 2,
    },
    {
      id: "cat-minuman-isi",
      name: "[ISI] Minuman Segar",
      slug: "minuman-segar-isi",
      sort: 3,
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sort: cat.sort },
      create: cat,
    });
  }
  console.log(`✓ ${categoriesData.length} categories seeded.`);

  // 3. Products (8 Products with [ISI] tags, Int IDR prices, variants & images)
  const productsData = [
    {
      id: "prod-pempek-kulit-isi",
      name: "[ISI] Pempek Kulit Crispy",
      slug: "pempek-kulit-crispy-isi",
      description: "[ISI] Pempek kulit ikan tenggiri asli dengan tekstur renyah di luar dan kenyal gurih di dalam, disajikan dengan cuko kental pedas manis.",
      price: 25000,
      comparePrice: 30000,
      isAvailable: true,
      stock: 50,
      isFeatured: true,
      categoryId: "cat-camilan-isi",
      variants: [
        { name: "[ISI] Paket Reguler (5 pcs)", priceDiff: 0 },
        { name: "[ISI] Paket Hemat (10 pcs)", priceDiff: 20000 },
      ],
      images: [
        { path: "/placeholder-product.jpg", alt: "[ISI] Foto Pempek Kulit Crispy", width: 800, height: 800, sort: 0 },
      ],
    },
    {
      id: "prod-keripik-pisang-isi",
      name: "[ISI] Keripik Pisang Cokelat Lumer",
      slug: "keripik-pisang-cokelat-lumer-isi",
      description: "[ISI] Keripik pisang renyah pilihan diselimuti cokelat premium lumer yang tebal dan legit mantap.",
      price: 18000,
      comparePrice: null,
      isAvailable: true,
      stock: 100,
      isFeatured: true,
      categoryId: "cat-camilan-isi",
      variants: [
        { name: "[ISI] Ukuran 150g", priceDiff: 0 },
        { name: "[ISI] Ukuran 300g", priceDiff: 15000 },
      ],
      images: [
        { path: "/placeholder-product.jpg", alt: "[ISI] Foto Keripik Pisang Cokelat", width: 800, height: 800, sort: 0 },
      ],
    },
    {
      id: "prod-makaroni-pedas-isi",
      name: "[ISI] Makaroni Pedas Daun Jeruk",
      slug: "makaroni-pedas-daun-jeruk-isi",
      description: "[ISI] Makaroni renyah gurih dibumbui cabai kering asli dan aroma wangi daun jeruk segar.",
      price: 15000,
      comparePrice: 18000,
      isAvailable: true,
      stock: 75,
      isFeatured: false,
      categoryId: "cat-camilan-isi",
      variants: [
        { name: "[ISI] Level 1 (Sedang)", priceDiff: 0 },
        { name: "[ISI] Level 3 (Pedas Nampol)", priceDiff: 0 },
      ],
      images: [
        { path: "/placeholder-product.jpg", alt: "[ISI] Foto Makaroni Pedas", width: 800, height: 800, sort: 0 },
      ],
    },
    {
      id: "prod-nasi-bakar-isi",
      name: "[ISI] Nasi Bakar Ayam Suwir Kemangi",
      slug: "nasi-bakar-ayam-suwir-kemangi-isi",
      description: "[ISI] Nasi gurih berbumbu rempah dibungkus daun pisang dan dibakar harum, berisikan ayam suwir pedas kemangi melimpah.",
      price: 28000,
      comparePrice: 32000,
      isAvailable: true,
      stock: 30,
      isFeatured: true,
      categoryId: "cat-makanan-isi",
      variants: [
        { name: "[ISI] Porsi Standar", priceDiff: 0 },
        { name: "[ISI] Plus Telur Asin", priceDiff: 5000 },
      ],
      images: [
        { path: "/placeholder-product.jpg", alt: "[ISI] Foto Nasi Bakar Ayam Suwir", width: 800, height: 800, sort: 0 },
      ],
    },
    {
      id: "prod-ayam-geprek-isi",
      name: "[ISI] Ayam Geprek Sambal Korek Bawang",
      slug: "ayam-geprek-sambal-korek-bawang-isi",
      description: "[ISI] Ayam goreng tepung krispi digeprek dengan sambal korek bawang segar pedas menggigit.",
      price: 22000,
      comparePrice: null,
      isAvailable: true,
      stock: 40,
      isFeatured: true,
      categoryId: "cat-makanan-isi",
      variants: [
        { name: "[ISI] Pilihan Dada / Paha Atas", priceDiff: 0 },
        { name: "[ISI] Tambah Keju Mozarella Lumer", priceDiff: 6000 },
      ],
      images: [
        { path: "/placeholder-product.jpg", alt: "[ISI] Foto Ayam Geprek Sambal Korek", width: 800, height: 800, sort: 0 },
      ],
    },
    {
      id: "prod-tekwan-isi",
      name: "[ISI] Tekwan Ikan Tenggiri Kuah Udang",
      slug: "tekwan-ikan-tenggiri-kuah-udang-isi",
      description: "[ISI] Bulatan daging ikan tenggiri lembut kenyal dengan kuah kaldu udang gurih hangat, jamur kuping, dan bengkuang.",
      price: 26000,
      comparePrice: null,
      isAvailable: true,
      stock: 25,
      isFeatured: false,
      categoryId: "cat-makanan-isi",
      variants: [
        { name: "[ISI] Porsi Komplit Siap Santap", priceDiff: 0 },
      ],
      images: [
        { path: "/placeholder-product.jpg", alt: "[ISI] Foto Tekwan Ikan Tenggiri", width: 800, height: 800, sort: 0 },
      ],
    },
    {
      id: "prod-es-kopi-isi",
      name: "[ISI] Es Kopi Susu Gula Aren Asli",
      slug: "es-kopi-susu-gula-aren-asli-isi",
      description: "[ISI] Perpaduan espresso kopi robusta lokal, susu segar creamy, dan pemanis alami sirup gula aren murni.",
      price: 18000,
      comparePrice: 20000,
      isAvailable: true,
      stock: 60,
      isFeatured: true,
      categoryId: "cat-minuman-isi",
      variants: [
        { name: "[ISI] Reguler (Cup 16oz)", priceDiff: 0 },
        { name: "[ISI] Large (Cup 22oz)", priceDiff: 4000 },
      ],
      images: [
        { path: "/placeholder-product.jpg", alt: "[ISI] Foto Es Kopi Susu Gula Aren", width: 800, height: 800, sort: 0 },
      ],
    },
    {
      id: "prod-es-teh-isi",
      name: "[ISI] Es Teh Leci Selasih Segar",
      slug: "es-teh-leci-selasih-segar-isi",
      description: "[ISI] Seduhan teh wangi melati berpadu dengan sari buah leci manis segar, buah leci utuh, dan biji selasih kenyal.",
      price: 14000,
      comparePrice: null,
      isAvailable: true,
      stock: 80,
      isFeatured: false,
      categoryId: "cat-minuman-isi",
      variants: [
        { name: "[ISI] Es Batu Normal", priceDiff: 0 },
        { name: "[ISI] Sedikit Es (Less Ice)", priceDiff: 0 },
      ],
      images: [
        { path: "/placeholder-product.jpg", alt: "[ISI] Foto Es Teh Leci Selasih", width: 800, height: 800, sort: 0 },
      ],
    },
  ];

  for (const prod of productsData) {
    const { variants, images, ...prodFields } = prod;

    const savedProduct = await prisma.product.upsert({
      where: { slug: prodFields.slug },
      update: {
        ...prodFields,
      },
      create: {
        ...prodFields,
      },
    });

    // Reset and insert variants
    await prisma.productVariant.deleteMany({ where: { productId: savedProduct.id } });
    if (variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((v) => ({
          productId: savedProduct.id,
          name: v.name,
          priceDiff: v.priceDiff,
        })),
      });
    }

    // Reset and insert images
    await prisma.productImage.deleteMany({ where: { productId: savedProduct.id } });
    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img) => ({
          productId: savedProduct.id,
          path: img.path,
          alt: img.alt,
          width: img.width,
          height: img.height,
          sort: img.sort,
        })),
      });
    }
  }
  console.log(`✓ ${productsData.length} sample products seeded.`);

  // 4. Testimonials (2 entries)
  const testimonialsData = [
    {
      id: "testi-1-isi",
      name: "[ISI] Pelanggan Setia Palembang",
      content: "[ISI] Rasanya juara banget, bumbu dan cukonya pas di lidah! Pengiriman juga cepat dan kemasan rapi sekali.",
      rating: 5,
      isVisible: true,
    },
    {
      id: "testi-2-isi",
      name: "[ISI] Pecinta Kuliner Nusantara",
      content: "[ISI] Sangat recommended untuk camilan santai keluarga atau acara kantor. Pasti repeat order lagi!",
      rating: 5,
      isVisible: true,
    },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log(`✓ ${testimonialsData.length} testimonials seeded.`);

  // 5. Admin User & Account (from .env)
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "ganti-password-ini-12345";
  const hashedPassword = await hashPassword(adminPassword);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin UMKM",
      role: "admin",
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      name: "Admin UMKM",
      role: "admin",
      emailVerified: true,
    },
  });

  const accountId = `account-${adminUser.id}`;
  await prisma.account.upsert({
    where: { id: accountId },
    update: {
      password: hashedPassword,
    },
    create: {
      id: accountId,
      userId: adminUser.id,
      accountId: adminUser.id,
      providerId: "credential",
      password: hashedPassword,
    },
  });
  console.log(`✓ Admin user created/updated: ${adminEmail}`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
