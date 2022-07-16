const { User, Product, ProductImage, Category } = require("../models");
const cloudinary = require("../../middleware/cloudinary");
const { IdNotFound } = require("../error");
const { Op } = require("sequelize");

const createProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const { nama, harga, deskripsi, idCategory } = req.body;
    const category = await Category.findByPk(idCategory);
    if (!category) {
      const err = new IdNotFound(idCategory);
      return res.status(404).json({
        errors: [err.details()],
      });
    }
    const product = await Product.create({
      userId: id,
      nama,
      harga,
      deskripsi,
      deletedAt: null,
    });

    if (req.files.product_images) {
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
    }

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

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({
      where: {
        id,
        deletedAt: null,
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

    if (!product) {
      const err = new IdNotFound(id);
      return res.status(404).json({
        errors: [err.details()],
      });
    }

    return res.status(200).json({
      message: "Successfully fetched",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getListProductUser = async (req, res) => {
  try {
    const { id } = req.user;
    const products = await Product.findAll({
      where: {
        userId: id,
        deletedAt: null,
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

    if (products.length === 0) {
      return res.status(204).end();
    }

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

const getListProducts = async (req, res) => {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";
    const products = await Product.findAll({
      where: {
        deletedAt: null,
        nama: {
          [Op.iLike]: `%${search}%`,
        },
      },
      include: [
        {
          model: Category,
          where: {
            nama: {
              [Op.iLike]: `%${category}%`,
            },
          },
        },
        {
          model: ProductImage,
        },
        {
          model: User,
        },
      ],
    });

    if (products.length === 0) {
      return res.status(204).end();
    }

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

const handleDeleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const idUser = req.user.id;
    const products = await Product.findAll({
      where: {
        userId: idUser,
        deletedAt: null,
      },
    });

    if (products.length === 0) {
      return res.status(400).json({
        errors: [
          {
            code: "E-018",
            message: "You don't have any product",
          },
        ],
      });
    }

    const product = products.filter((product) => {
      return product.id == id;
    });

    if (product.length === 0) {
      const err = new IdNotFound(id);
      return res.status(404).json({
        errors: [err.details()],
      });
    }

    const deletedProduct = product[0];

    deletedProduct.update({
      deletedAt: new Date(),
    });

    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleUpdateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const idUser = req.user.id;
    const { nama, harga, deskripsi } = req.body;

    const products = await Product.findAll({
      where: {
        userId: idUser,
        deletedAt: null,
      },
      include: [
        {
          model: ProductImage,
        },
      ],
    });

    if (products.length === 0) {
      return res.status(400).json({
        errors: [
          {
            code: "E-018",
            message: "You don't have any product",
          },
        ],
      });
    }

    const product = products.filter((product) => {
      return product.id == id;
    });

    if (product.length === 0) {
      const err = new IdNotFound(id);
      return res.status(404).json({
        errors: [err.details()],
      });
    }

    const updatedProduct = product[0];

    const productImage = await ProductImage.findAll({
      where: {
        productId: updatedProduct.id,
      },
    });

    if (req.files.product_images) {
      const data = await uploadMultipleFiles(req, res);
      const uploadedFile = await Promise.all(data);
      const urls = uploadedFile.map((file) => {
        return file.url;
      });
      if (productImage.length > 0) {
        productImage.forEach(async (image) => {
          await image.destroy();
        });
      }
      urls.forEach(async (url) => {
        await ProductImage.create({
          productId: updatedProduct.id,
          image: url,
        });
      });
    }

    await updatedProduct.update({
      nama,
      harga,
      deskripsi,
    });

    return res.status(200).json({
      message: "Successfully updated",
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

module.exports = { createProduct, getProductById, getListProductUser, getListProducts, handleDeleteProduct, handleUpdateProduct };
