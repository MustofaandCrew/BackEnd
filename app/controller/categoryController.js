const { Category } = require("../models");
const { Success, CreatedSusscess, UpdatedSuccess, DeleteSuccess, IdNotFound, NullBody, BadRequest } = require("../../helper");

const getListCategories = async (req, res) => {
  try {
    const data = await Category.findAll();
    if (data.length === 0) {
      const nullBody = new NullBody(req.body);
      return res.status(204).json({
        code : nullBody.details().code,
        message : nullBody.details().message,
      });
    } else if (data.length > 0) {
      const success = new Success();
      return res.status(200).json({
        code: success.details().code,
        data,
      });
    }
  } catch (error) {
    const badRequest = new BadRequest(req.body);
    res.status(400).json({
      code : badRequest.details().code,
      message : badRequest.details().message,
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
      const idNotFound = new IdNotFound(req.params.id);
      return res.status(204).json({
        code: idNotFound.details().code,
        message: idNotFound.details().message,
        });
    } else if (data !== null) {
      const success = new Success();
      return res.status(200).json({
        code: success.details().code,
        data: data,
      });
    }
  } catch (error) {
    const badRequest = new BadRequest(req.body);
    return res.status(400).json({
      code : badRequest.details().code,
      message : badRequest.details().message,
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
      const nullBody = new NullBody(req.body);
      return res.status(204).json({
        code : nullBody.details().code,
        message : nullBody.details().message,
      });
    }
    const data = await Category.create({
      nama: req.body.nama,
    });
    const createdSusscess = new CreatedSusscess(data);
    return res.status(201).json({
      code: createdSusscess.details().code,
      data: data,
    });
  } catch (error) {
    const badRequest = new BadRequest(req.body);
    return res.status(400).json({
      code : badRequest.details().code,
      message : badRequest.details().message,
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
        const idNotFound = new IdNotFound(req.params.id);
        return res.status(204).json({
          code: idNotFound.details().code,
        });
      }
      const data = await Category.update(
        {
            nama: req.body.nama,
        },
        {
        where: {
          id: req.params.id,
        },
      });
      const updateSuccess = new UpdatedSuccess();
      return res.status(200).json({
        code : updateSuccess.details().code,
        message : updateSuccess.details().message,
      });
    } catch (error) {
      const badRequest = new BadRequest(req.body);
      return res.status(400).json({
        code : badRequest.details().code,
        message : badRequest.details().message,
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
      const idNotFound = new IdNotFound(req.params.id);
      return res.status(204).json({
        code: idNotFound.details().code,
        message: idNotFound.details().message,
      });
    }
    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    const deleteSuccess = new DeleteSuccess(req.params.id);
    return res.status(200).json({
      code: deleteSuccess.details().code,
      message: deleteSuccess.details().message,
    });
  } catch (error) {
    const badRequest = new BadRequest(req.body);
    return res.status(400).json({
      code : badRequest.details().code,
      message : badRequest.details().message,
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
