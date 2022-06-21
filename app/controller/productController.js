const { User, Product, ProductImage, Category } = require("../models");
const cloudinary = require("../../middleware/cloudinary");
const { IdNotFound } = require("../error");

const createProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const { nama, harga, deskripsi, idCategory } = req.body;
    const category = await Category.findByPk(idCategory);
    if (!category) {
      const err = new IdNotFound(idCategory);
      return res.status(400).json(err.details());
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
    const products = await Product.findAll({
      where: {
        deletedAt: null,
      },
      include: [
        {
          model: Category,
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
      },
    });

    if (products.length === 0) {
      return res.status(400).json({
        message: "You don't have any product",
      });
    }

    const product = products.filter((product) => {
      return product.id == id;
    });

    if (product.length === 0) {
      const err = new IdNotFound(id);
      return res.status(404).json(err.details());
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
    const idUser = req.user;
    const { nama, harga, deskripsi, idCategory } = req.body;

    const products = await Product.findAll({
      where: {
        userId: idUser,
      },
    });

    if (products.length === 0) {
      return res.status(400).json({
        message: "You don't have any product",
      });
    }

    const product = products.filter((product) => {
      return product.id == id;
    });

    if (product.length === 0) {
      const err = new IdNotFound(id);
      return res.status(404).json(err.details());
    }

    const updatedProduct = product[0];

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

module.exports = { createProduct, getListProductUser, getListProducts, handleDeleteProduct };
