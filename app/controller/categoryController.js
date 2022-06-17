const { Category } = require("../models");
const { Op } = require("sequelize");
const { IdNotFound, NullBody, UniqueColumnAlreadyExisted } = require("../error");

const getListCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    if (categories.length === 0) {
      return res.status(204).end();
    }
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
      const err = new IdNotFound(req.params.id);
      return res.status(404).json(err.details());
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
    const category = await Category.create({
      nama: req.body.nama,
    });

    return res.status(201).json({
      status: "Category created successfully",
      category,
    });
  } catch (error) {
    const err = new NullBody();
    return res.status(400).json(err.details());
  }
};

const updateCategory = async (req, res) => {
  try {
    const exist = await Category.findByPk(req.params.id);
    if (!exist) {
      const err = new IdNotFound(req.params.id);
      return res.status(404).json(err.details());
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
      return res.status(400).json(err.details());
    }

    const category = await exist.update({
      nama: req.body.nama,
    });
    return res.status(200).json({
      status: "Category updated successfully",
      category,
    });
  } catch (error) {
    const err = new NullBody();
    return res.status(400).json(err.details());
  }
};

const deleteCategory = async (req, res) => {
  try {
    const exist = await Category.findByPk(req.params.id);
    if (!exist) {
      const err = new IdNotFound(req.params.id);
      return res.status(404).json(err.details());
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
