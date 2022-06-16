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

module.exports = { createProduct };
