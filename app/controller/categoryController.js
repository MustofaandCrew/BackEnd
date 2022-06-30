const { Category } = require("../models");
const { Op } = require("sequelize");
const { IdNotFound, UniqueColumnAlreadyExisted } = require("../error");

const getListCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    console.log(categories);
    if (categories.length === 0) {
      return res.status(204).end();
    }
    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const getListCategoriesById = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!category) {
      const err = new IdNotFound(req.params.id);
      return res.status(404).json({
        errors: [err.details()],
      });
    }
    return res.status(200).json({
      message: "Category By Id fetched successfully",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const exist = await Category.findOne({
      where: {
        nama: req.body.nama,
      },
    });

    if (exist) {
      const err = new UniqueColumnAlreadyExisted(req.body.nama);
      return res.status(400).json({
        errors: [err.details()],
      });
    }

    const category = await Category.create({
      nama: req.body.nama,
    });

    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const exist = await Category.findByPk(req.params.id);
    if (!exist) {
      const err = new IdNotFound(req.params.id);
      return res.status(404).json({
        errors: [err.details()],
      });
    }

    const sameName = await Category.findOne({
      where: {
        nama: req.body.nama,
        id: {
          [Op.ne]: req.params.id,
        },
      },
    });

    if (sameName) {
      const err = new UniqueColumnAlreadyExisted(req.body.nama);
      return res.status(400).json({
        errors: [err.details()],
      });
    }

    await exist.update({
      nama: req.body.nama,
    });
    return res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const exist = await Category.findByPk(req.params.id);
    if (!exist) {
      const err = new IdNotFound(req.params.id);
      return res.status(404).json({
        errors: [err.details()],
      });
    }

    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
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
