const categoryController = require("./categoryController");
// const { sequelize } = require('../models');
const { array } = require("../../middleware/multer");
// const { queryInterface } = sequelize;

const { Category } = require("../models");
const { Op } = require("sequelize");
// beforeAll(async () => {
//     await queryInterface.bulkInsert('Category', [
//         {
//             nama: 'Elektronik',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         }
//     ], {});
// });

// afterAll(async () => {
//     await queryInterface.bulkDelete('Category', null, {
//         truncate: true,
//         restartIdentity: true,
//     });
// });
beforeAll(async () => {
  await Category.create({
    id: 3,
    nama: "Pakaian Pria",
  });
});

afterAll(async () => {
  await Category.destroy({
    where: {
      nama: "Pakaian Wanita",
    },
  });
});

describe("Category Controller", () => {
  describe("#getListCategories() WithContent", () => {
    it("should return all categories success 200", async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await categoryController.getListCategories(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: expect.any(Array),
      });
    });
  });

  describe("#getListCategoriesById()", () => {
    it("should return a list of categories success 200", async () => {
      const mockRequest = {
        params: {
          id: 1,
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await categoryController.getListCategoriesById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: expect.any(Object),
      });
    });
    it("should return 404 not found", async () => {
      const mockRequest = {
        params: {
          id: 12,
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await categoryController.getListCategoriesById(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: expect.any(String),
          },
        ],
      });
    });
    it("should return a an error 400", async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await categoryController.getListCategoriesById(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  });

  describe("#createCategory()", () => {
    it("should create a new category success 201", async () => {
      const mockRequest = {
        body: {
          nama: "Pakaian Wanita",
        },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await categoryController.createCategory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: expect.any(Object),
      });
    });
    it("should return 400 if there's an error", async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await categoryController.createCategory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  });

  describe("#updateCategory() Success", () => {
    it("should update the category success 200", async () => {
      const mockRequest = {
        params: {
          id: 3,
        },
        body: {
          nama: "Kendaraan",
        },
      };
      const mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      };

      await categoryController.updateCategory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("Category not found 404 error", async () => {
      const mockRequest = {
        params: {
          id: 100,
        },
      };
      const mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      };

      await categoryController.updateCategory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: expect.any(String),
          },
        ],
      });
    });
    it("Category exist 400 error", async () => {
      const mockRequest = {
        params: {
          id: 3,
        },
        body: {
          nama: "Elektronik",
        },
      };
      const mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      };

      await categoryController.updateCategory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: expect.any(String),
          },
        ],
      });
    });
    it("should return 400 error", async () => {
      const mockRequest = {};
      const mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      };

      await categoryController.updateCategory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  });
  describe("#deleteCategory() Success", () => {
    it("should delete a category success 200", async () => {
      const mockRequest = {
        params: {
          id: 3,
        },
      };
      const mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      };

      await categoryController.deleteCategory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("Category is not found", async () => {
      const mockRequest = {
        params: {
          id: 12,
        },
      };
      const mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      };

      await categoryController.deleteCategory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: expect.any(String),
          },
        ],
      });
    });
    it("should return 400 if there's an error", async () => {
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await categoryController.deleteCategory(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  });
});
