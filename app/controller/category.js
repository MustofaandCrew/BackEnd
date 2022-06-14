const { Category }  = require('../models');

const getListCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        return res.status(200).json({
            message: "Categories fetched successfully",
            categories
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to fetch categories",
            error: error
        });
    }
};

const getListCategoriesById = async (req, res) => {
    try {
        const categories = await Category.findOne({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({
            message: "Categories By Id fetched successfully",
            Category: categories
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to fetch categories",
            error: error
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await Category.create({
            nama: req.body.nama
        });
        return res.status(200).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to create category",
            error: error
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Category.update({
            nama: req.body.nama,
        }, {
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to update category",
            error: error
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({
            message: "Category deleted successfully",
            category
        });
    } catch (error) {
        return res.status(400).json({
            message: "Failed to delete category",
            error: error
        });
    }
};

module.exports = {
    getListCategories,
    getListCategoriesById,
    createCategory,
    updateCategory,
    deleteCategory
};