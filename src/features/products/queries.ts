import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export type ProductWithRelations = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;

export async function getCategories() {
  try {
    return await db.category.findMany({
      orderBy: { sort: "asc" },
      include: {
        _count: {
          select: {
            products: {
              where: {
                deletedAt: null,
                isAvailable: true,
              },
            },
          },
        },
      },
    });
  } catch {
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    return await db.product.findMany({
      where: {
        deletedAt: null,
        isAvailable: true,
        isFeatured: true,
      },
      include: {
        images: {
          orderBy: { sort: "asc" },
        },
        variants: true,
        category: true,
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export type ProductFilterParams = {
  category?: string;
  query?: string;
  sort?: "terbaru" | "termurah" | "termahal" | "nama-asc";
  page?: number;
  limit?: number;
};

export async function getProducts(params: ProductFilterParams = {}) {
  const { category, query, sort = "terbaru", page = 1, limit = 12 } = params;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ProductWhereInput = {
    deletedAt: null,
  };

  if (category) {
    whereClause.category = {
      slug: category,
    };
  }

  if (query && query.trim() !== "") {
    whereClause.OR = [
      { name: { contains: query.trim(), mode: "insensitive" } },
      { description: { contains: query.trim(), mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = {
    createdAt: "desc",
  };

  if (sort === "termurah") {
    orderBy = { price: "asc" };
  } else if (sort === "termahal") {
    orderBy = { price: "desc" };
  } else if (sort === "nama-asc") {
    orderBy = { name: "asc" };
  }

  try {
    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        include: {
          images: {
            orderBy: { sort: "asc" },
          },
          variants: true,
          category: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({
        where: whereClause,
      }),
    ]);

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch {
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await db.product.findUnique({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        images: {
          orderBy: { sort: "asc" },
        },
        variants: {
          orderBy: { priceDiff: "asc" },
        },
        category: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  try {
    return await db.product.findMany({
      where: {
        deletedAt: null,
        isAvailable: true,
        id: { not: productId },
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        images: {
          orderBy: { sort: "asc" },
        },
        variants: true,
        category: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
