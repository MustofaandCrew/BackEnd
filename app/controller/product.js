const { Product }  = require('../models');

const getListProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json({
            message: "products fetched successfully",
            products
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to fetch products",
            error: error
        });
    }
};

const getListProductsById = async (req, res) => {
    try {
        const products = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({
            message: "products By Id fetched successfully",
            Product: products
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to fetch products",
            error: error
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            nama: req.body.nama,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
        });
        return res.status(200).json({
            message: "product created successfully",
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to create product",
            error: error
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const Product = await Product.update({
            nama: req.body.nama,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
        }, {
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({
            message: "product updated successfully",
            Product
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to update product",
            error: error
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const Product = await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({
            message: "product deleted successfully",
            Product
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to delete product",
            error: error
        });
    }
};

module.exports = {
    getListProducts,
    getListProductsById,
    createProduct,
    updateProduct,
    deleteProduct
};