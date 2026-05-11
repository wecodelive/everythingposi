const prisma = require("../prisma/index.jsx");

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureDefaultCategories = async () => {
  const defaults = [
    { name: "High Jewelry", slug: "high-jewelry", description: "Exceptional high jewelry pieces" },
    { name: "Jewelry", slug: "jewelry", description: "Signature fine jewelry collections" },
    { name: "Watches", slug: "watches", description: "Luxury timepieces" },
    { name: "Bags & Accessories", slug: "bags-accessories", description: "Bags and accessories" },
    { name: "Fragrance", slug: "fragrance", description: "Luxury fragrances" },
    { name: "Engagement & Bridal", slug: "engagement-bridal", description: "Engagement and bridal jewelry" },
    { name: "Gifts", slug: "gifts", description: "Curated gifts" },
  ];

  const categories = await Promise.all(
    defaults.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      }),
    ),
  );

  const categoriesBySlug = new Map(
    categories.map((category) => [category.slug, category]),
  );

  const productTypeDefaults = [
    { name: "Bracelets", slug: "bracelets", categorySlug: "jewelry" },
    { name: "Rings", slug: "rings", categorySlug: "jewelry" },
    { name: "Necklaces", slug: "necklaces", categorySlug: "jewelry" },
    { name: "Earrings", slug: "earrings", categorySlug: "jewelry" },
    { name: "Men", slug: "men", categorySlug: "watches" },
    { name: "Women", slug: "women", categorySlug: "watches" },
    { name: "Exceptional Watches", slug: "exceptional-watches", categorySlug: "watches" },
    { name: "Men's Bags", slug: "mens-bags", categorySlug: "bags-accessories" },
    { name: "Women's Bags", slug: "womens-bags", categorySlug: "bags-accessories" },
    { name: "Accessories", slug: "accessories", categorySlug: "bags-accessories" },
    { name: "Sunglasses", slug: "sunglasses", categorySlug: "bags-accessories" },
    { name: "Engagement Rings", slug: "engagement-rings", categorySlug: "engagement-bridal" },
    { name: "Wedding Bands", slug: "wedding-bands", categorySlug: "engagement-bridal" },
    { name: "For Him", slug: "for-him", categorySlug: "gifts" },
    { name: "For Her", slug: "for-her", categorySlug: "gifts" },
  ];

  await Promise.all(
    productTypeDefaults.map((productType) => {
      const category = categoriesBySlug.get(productType.categorySlug);
      if (!category) return null;

      return prisma.productType.upsert({
        where: {
          name_categoryId: {
            name: productType.name,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          name: productType.name,
          slug: productType.slug,
          categoryId: category.id,
        },
      });
    }),
  );
};

exports.getCategories = async (req, res) => {
  try {
    await ensureDefaultCategories();

    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        productTypes: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
        _count: {
          select: { products: true, productTypes: true },
        },
      },
    });

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;

    if (!name?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const normalizedName = name.trim();
    const categorySlug = slugify(slug || normalizedName);

    const category = await prisma.category.create({
      data: {
        name: normalizedName,
        description: description?.trim() || null,
        slug: categorySlug,
      },
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, slug } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (!name?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const normalizedName = name.trim();
    const categorySlug = slugify(slug || normalizedName);

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: normalizedName,
        description: description?.trim() || null,
        slug: categorySlug,
      },
    });

    res.status(200).json({ success: true, category });
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { products: true, productTypes: true },
        },
      },
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (category._count.products > 0 || category._count.productTypes > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete category with existing products or product types",
      });
    }

    await prisma.category.delete({ where: { id: categoryId } });

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getProductTypes = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const where = {
      isActive: true,
      ...(categoryId ? { categoryId } : {}),
    };

    const productTypes = await prisma.productType.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    res.status(200).json({ success: true, productTypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.createProductType = async (req, res) => {
  try {
    const { name, description, slug, categoryId } = req.body;

    if (!name?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Product type name is required" });
    }

    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const normalizedName = name.trim();
    const typeSlug = slugify(slug || normalizedName);

    const productType = await prisma.productType.create({
      data: {
        name: normalizedName,
        description: description?.trim() || null,
        slug: typeSlug,
        categoryId,
      },
    });

    res.status(201).json({ success: true, productType });
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Product type already exists for this category",
      });
    }

    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateProductType = async (req, res) => {
  try {
    const { productTypeId } = req.params;
    const { name, description, slug, categoryId } = req.body;

    const existingProductType = await prisma.productType.findUnique({
      where: { id: productTypeId },
    });

    if (!existingProductType) {
      return res
        .status(404)
        .json({ success: false, message: "Product type not found" });
    }

    if (!name?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Product type name is required" });
    }

    const resolvedCategoryId = categoryId || existingProductType.categoryId;

    const category = await prisma.category.findUnique({
      where: { id: resolvedCategoryId },
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const normalizedName = name.trim();
    const typeSlug = slugify(slug || normalizedName);

    const productType = await prisma.productType.update({
      where: { id: productTypeId },
      data: {
        name: normalizedName,
        description: description?.trim() || null,
        slug: typeSlug,
        categoryId: resolvedCategoryId,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    res.status(200).json({ success: true, productType });
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Product type name or slug already exists for this category",
      });
    }

    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteProductType = async (req, res) => {
  try {
    const { productTypeId } = req.params;

    const productType = await prisma.productType.findUnique({
      where: { id: productTypeId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!productType) {
      return res
        .status(404)
        .json({ success: false, message: "Product type not found" });
    }

    if (productType._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete product type with existing products",
      });
    }

    await prisma.productType.delete({ where: { id: productTypeId } });

    res.status(200).json({ success: true, message: "Product type deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
