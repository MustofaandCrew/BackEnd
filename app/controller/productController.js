const { Product } = require("../models");

const getListProducts = async (req, res) => {
  try {
    const data = await Product.findAll();
    if (data.length === 0) {
      return res.status(204).json({
        code: "Products not found",
      });
    } else if (data.length > 0) {
      return res.status(200).json({
        code: "Products fetched successfully",
        data,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Failed to fetch Products",
      error: error,
    });
  }
};

const getListProductsById = async (req, res) => {
  try {
    const data = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (data === null) {
      return res.status(204).json({
        code: "Products not found",
      });
    } else if (data !== null) {
      return res.status(200).json({
        code: "Products By Id fetched successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "Failed to fetch Products",
      error: error,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    if (
      req.body.nama === null ||
      req.body.nama === "" ||
      req.body.nama === undefined
    ) {
      return res.status(204).json({
        code: "No data added",
      });
    }
    const data = await Product.create({
      nama: req.body.nama,
      harga: req.body.harga,
      deskripsi: req.body.deskripsi,
    });

    return res.status(201).json({
      status: "Product created successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed to create Product",
      error: error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const exist = await Product.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (exist === null) {
        return res.status(204).json({
          code: "Products not found",
        });
      }
      await Product.update(
        {
            nama: req.body.nama,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
        },
        {
        where: {
          id: req.params.id,
        },
      });
      return res.status(200).json({
        code : "Product updated successfully",
      });
    } catch (error) {
      return res.status(400).json({
        status: "Failed to updated Product",
        error: error,
      });
    }
};

const deleteProduct = async (req, res) => {
  try {
    const exist = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (exist === null) {
      return res.status(204).json({
        code: "Products not found",
      });
    }
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({
      code: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed to delete Product",
      error: error,
    });
  }
};

module.exports = {
  getListProducts,
  getListProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
};
