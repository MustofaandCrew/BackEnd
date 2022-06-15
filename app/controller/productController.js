const { User, Product, ProductImage, Category } = require("../models");

const createProduct = async (req, res) => {
  try {
    const { id } = req.params.id;
    const { nama, harga, deskripsi } = req.body;
  } catch (error) {}
};
