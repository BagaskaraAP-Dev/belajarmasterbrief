import React from "react";

type LocalBusinessJsonLdProps = {
  name: string;
  description?: string | null;
  telephone: string;
  address?: string | null;
  url: string;
  openHours?: string | null;
};

export function LocalBusinessJsonLd({
  name,
  description,
  telephone,
  address,
  url,
  openHours,
}: LocalBusinessJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    description: description || undefined,
    telephone,
    url,
    address: address
      ? {
          "@type": "PostalAddress",
          streetAddress: address,
          addressCountry: "ID",
        }
      : undefined,
    openingHours: openHours || undefined,
    priceRange: "Rp 10.000 - Rp 100.000",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

type ProductJsonLdProps = {
  name: string;
  description: string;
  image?: string | null;
  price: number;
  isAvailable: boolean;
  url: string;
};

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  isAvailable,
  url,
}: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image ? [image] : undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "IDR",
      price,
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
