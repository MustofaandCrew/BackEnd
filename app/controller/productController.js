const { User, Product, ProductImage, Category } = require("../models");
const cloudinary = require("../../middleware/cloudinary");

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

    const data = await uploadMultipleFiles(req, res);
    const uploadedFile = await Promise.all(data);
    const urls = uploadedFile.map((file) => {
      return file.url;
    });
    urls.forEach(async (url) => {
      await ProductImage.create({
        productId: product.id,
        image: url,
      });
    });

    await product.addCategory(category);

    const result = await Product.findOne({
      where: { id: product.id },
      include: [
        {
          model: Category,
        },
        {
          model: ProductImage,
        },
      ],
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

const getListProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const products = await Product.findAll({
      where: {
        userId: id,
      },
      include: [
        {
          model: Category,
        },
        {
          model: ProductImage,
        },
      ],
    });

    return res.status(200).json({
      message: "Successfully fetched",
      data: products,
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

module.exports = { createProduct, getListProduct };
