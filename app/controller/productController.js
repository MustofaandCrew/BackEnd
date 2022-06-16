const { User, Product, ProductImage, Category } = require("../models");

const createProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const { nama, harga, deskripsi, idCategory } = req.body;
    const category = await Category.findByPk(idCategory);
    if (!category) {
      return res.status(400).json({
        message: "Category not found",
      });
    }
    const product = await Product.create({
      userId: id,
      nama,
      harga,
      deskripsi,
    });
    await product.addCategory(category);
    const result = await Product.findOne({
      where: { id: product.id },
      include: Category,
    });
    return res.status(201).json({
      message: "Product created",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const uploadMultipleFiles = (req, res) => {
  const uploadedFile = req.files.product_images.map((file) => {
    const fileBase64 = file.buffer.toString("base64");
    const fileUpload = `data:${file.mimetype};base64,${fileBase64}`;

    return cloudinary.uploader.upload(fileUpload, (err, result) => {
      if (err) {
        return false;
      }
      return result.url;
    });
  });

  return uploadedFile;
};

module.exports = { createProduct };
