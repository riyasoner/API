const db = require("../../../config/config");
const { Product, Variant } = db;
exports.createProduct = async (req, res) => {
  try {
    const { title, description } = req.body;
    let variants = req.body.variants;

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title and at least one variant are required",
      });
    }

    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch {
        return res.status(400).json({
          status: false,
          message: "Invalid JSON format for variants",
        });
      }
    }

    if (!Array.isArray(variants) || !variants.length) {
      return res.status(400).json({
        status: false,
        message: "Variants must be a non-empty array",
      });
    }

    const productImages =
      req.files
        ?.filter((file) => file.fieldname === "productImage")
        .map((file) => `/productImage/${file.filename}`) || [];

    const product = await Product.create({
      title,
      description,
      images: productImages,
    });

    const variantData = variants.map((variant, index) => {
      const variantImages =
        req.files
          ?.filter((file) => file.fieldname === `variantImage_${index}`)
          .map((file) => `/variantImage/${file.filename}`) || [];

      return {
        productId: product.id,
        price: variant.price,
        quantity: variant.quantity,
        variantImages,
      };
    });

    await Variant.bulkCreate(variantData);

    return res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: { product, variants: variantData },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Variant,
          as: "variants",
        },
      ],
      order: [["id", "ASC"]],
    });

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const data = products.map((product) => {
      let productImages = [];
      try {
        productImages = Array.isArray(product.images)
          ? product.images
          : JSON.parse(product.images || "[]");
      } catch {
        productImages = [];
      }
      productImages = productImages.map((img) => `${hostUrl}${img}`);

      const variants = (product.variants || []).map((variant) => {
        let variantImages = [];
        try {
          variantImages = Array.isArray(variant.variantImages)
            ? variant.variantImages
            : JSON.parse(variant.variantImages || "[]");
        } catch {
          variantImages = [];
        }
        variantImages = variantImages.map((img) => `${hostUrl}${img}`);

        return {
          id: variant.id,
          price: variant.price,
          quantity: variant.quantity,
          variantImages,
        };
      });

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        images: productImages,
        variants,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Products fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, variants } = req.body;

    const product = await Product.findByPk(id, {
      include: [{ model: Variant, as: "variants" }],
    });

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    // Parse variants if sent as string
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (err) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid JSON format for variants" });
      }
    }

    // Update product fields
    if (title) product.title = title;
    if (description) product.description = description;

    // Add new product images (append to existing)
    const newProductImages = (req.files || [])
      .filter((f) => f.fieldname === "productImage")
      .map((f) => `/productImage/${f.filename}`);

    product.images = newProductImages;
    await product.save();

    // Handle variants
    if (Array.isArray(variants)) {
      for (let index = 0; index < variants.length; index++) {
        const v = variants[index];
        const existingVariant = product.variants.find((va) => va.id === v.id);

        const newVariantImages = (req.files || [])
          .filter((f) => f.fieldname === `variantImage_${index}`)
          .map((f) => `/variantImage/${f.filename}`);

        if (existingVariant) {
          existingVariant.price = v.price ?? existingVariant.price;
          existingVariant.quantity = v.quantity ?? existingVariant.quantity;
          existingVariant.variantImages = newVariantImages;
          await existingVariant.save();
        } else {
          await Variant.create({
            productId: product.id,
            price: v.price,
            quantity: v.quantity,
            variantImages: newVariantImages,
          });
        }
      }
    }

    const updatedProduct = await Product.findByPk(id, {
      include: [{ model: Variant, as: "variants" }],
    });

    return res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: {
        ...updatedProduct.toJSON(),
        images: updatedProduct.images || [],
        variants: updatedProduct.variants.map((v) => ({
          ...v.toJSON(),
        })),
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
exports.softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    product.isDeleted = true;
    await product.save();

    return res.status(200).json({
      status: true,
      message: "Product soft deleted successfully",
    });
  } catch (error) {
    console.error("Error soft deleting product:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
