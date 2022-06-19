const { Category } = require("../models");

const getListCategories = async (req, res) => {
  try {
    const data = await Category.findAll();
    if (data.length === 0) {
      return res.status(204).json({
        code: "Categories not found",
      });
    } else if (data.length > 0) {
      return res.status(200).json({
        code: "Categories fetched successfully",
        data,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "Failed to fetch categories",
      error: error,
    });
  }
};

const getListCategoriesById = async (req, res) => {
  try {
    const data = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (data === null) {
      return res.status(204).json({
        code: "Categories not found",
      });
    } else if (data !== null) {
      return res.status(200).json({
        code: "Categories By Id fetched successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "Failed to fetch categories",
      error: error,
    });
  }
};

const createCategory = async (req, res) => {
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
    const data = await Category.create({
      nama: req.body.nama,
    });

    return res.status(201).json({
      status: "Category created successfully",
      data,
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
    const exist = await Category.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (exist === null) {
        return res.status(204).json({
          code: "Categories not found",
        });
      }
      await Category.update(
        {
            nama: req.body.nama,
        },
        {
        where: {
          id: req.params.id,
        },
      });
      return res.status(200).json({
        code : "Category updated successfully",
      });
    } catch (error) {
      return res.status(400).json({
        status: "Failed to updated category",
        error: error,
      });
    }
};

const deleteCategory = async (req, res) => {
  try {
    const exist = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (exist === null) {
      return res.status(204).json({
        code: "Categories not found",
      });
    }
    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({
      code: "Category deleted successfully",
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
