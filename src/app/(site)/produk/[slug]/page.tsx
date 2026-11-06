import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/features/products/queries";
import { getStoreSettings } from "@/features/settings/queries";
import { ProductGallery } from "@/components/site/product-gallery";
import { ProductOrderBox } from "@/components/site/product-order-box";
import { ProductCard } from "@/components/site/product-card";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/site/json-ld";
import { ChevronRight, ShieldCheck, Truck, RefreshCcw } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getStoreSettings(),
  ]);

  if (!product) {
    return { title: "Produk Tidak Ditemukan" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contoh-umkm.my.id";
  const productUrl = `${siteUrl}/produk/${product.slug}`;
  const mainImage = product.images[0]?.path
    ? `${siteUrl}${product.images[0].path}`
    : `${siteUrl}/og-default.jpg`;

  return {
    title: `${product.name} - ${settings.name}`,
    description: product.description.slice(0, 155),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} - ${settings.name}`,
      description: product.description.slice(0, 155),
      url: productUrl,
      images: [{ url: mainImage, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getStoreSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contoh-umkm.my.id";
  const productUrl = `${siteUrl}/produk/${product.slug}`;
  const relatedProducts = await getRelatedProducts(product.id, product.categoryId, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Structured Data */}
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={
          product.images[0]?.path
            ? `${siteUrl}${product.images[0].path}`
            : null
        }
        price={product.price}
        isAvailable={product.isAvailable}
        url={productUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: siteUrl },
          { name: "Katalog", url: `${siteUrl}/produk` },
          { name: product.name, url: productUrl },
        ]}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-amber-700 transition">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/produk" className="hover:text-amber-700 transition">
          Katalog
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link
              href={`/produk?kategori=${product.category.slug}`}
              className="hover:text-amber-700 transition"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold text-stone-900 truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Info (2 columns on md+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Product Gallery */}
        <div>
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Right: Info & Order Box */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5 block">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Order box */}
          <ProductOrderBox
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              comparePrice: product.comparePrice,
              isAvailable: product.isAvailable,
              stock: product.stock,
              variants: product.variants,
              imagePath: product.images[0]?.path || null,
            }}
            waNumber={settings.waNumber}
          />

          {/* Description Section */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h2 className="text-base font-bold text-stone-900">Deskripsi Produk</h2>
            <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Customer assurance badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span className="text-[11px] font-semibold text-stone-800">100% Halal</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-amber-600" />
              <span className="text-[11px] font-semibold text-stone-800">Pesan Cepat</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center gap-1.5">
              <RefreshCcw className="w-5 h-5 text-amber-600" />
              <span className="text-[11px] font-semibold text-stone-800">Jaminan Segar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Produk Terkait Lainnya
            </h2>
            <Link
              href="/produk"
              className="text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 transition"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
