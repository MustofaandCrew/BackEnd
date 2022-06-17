const { Category } = require("../models");
const { IdNotFound, NullBody } = require("../error");

const getListCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json({
      status: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed to fetch categories",
      error: error,
    });
  }
};

const getListCategoriesById = async (req, res) => {
  try {
    const categories = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!categories) {
      const err = new IdNotFound(req.params.id).details();
      return res.status(404).json({
        code: err.code,
        message: err.message,
      });
    }
    return res.status(200).json({
      status: "Categories By Id fetched successfully",
      Category: categories,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed to fetch categories",
      error: error,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      console.log("Masuk");
      const err = new NullBody().details();
      return res.status(400).json({
        code: err.code,
        message: err.message,
      });
    }
    const category = await Category.create({
      nama: req.body.nama,
    });
    return res.status(201).json({
      status: "Category created successfully",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed to create category",
      error: error,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const exist = await Category.findByPk(req.params.id);
    if (!exist) {
      const err = new IdNotFound(req.params.id).details();
      return res.status(404).json({
        code: err.code,
        message: err.message,
      });
    }
    const category = await Category.update(
      {
        nama: req.body.nama,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    return res.status(200).json({
      status: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed to update category",
      error: error,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const exist = await Category.findByPk(req.params.id);
    if (!exist) {
      const err = new IdNotFound(req.params.id).details();
      return res.status(404).json({
        code: err.code,
        message: err.message,
      });
    }
    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({
      status: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Failed to delete category",
      error: error,
    });
  }
};

module.exports = {
  getListCategories,
  getListCategoriesById,
  createCategory,
  updateCategory,
  deleteCategory,
};
