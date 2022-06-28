const productController = require("./productController");
const { Product, Category, ProductImage, User } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");

beforeAll(async () => {
  await Product.create({
    id: 10,
    userId: 1,
    nama: "Gamepad",
    harga: 10000,
    deskripsi: "Ini gamepad mahal",
  });
});
afterAll(async () => {
  await Product.destroy({
    where: {
      id: 10,
    },
  });
});

describe("productController", () => {
  describe("getListProducts", () => {
    it("should return 200 and get all products", async () => {
      const req = {
        query: {
          search: "",
          category: "",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const mockData = await Product.findAll({
        where: {
          deletedAt: null,
          nama: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        include: [
          {
            model: Category,
            where: {
              nama: {
                [Op.iLike]: `%${req.query.category}%`,
              },
            },
          },
          {
            model: ProductImage,
          },
          {
            model: User,
          },
        ],
      });
      await productController.getListProducts(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully fetched",
        data: mockData,
      });
    });
    it("should return 400", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.getListProducts(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
  });
  describe("getProductById", () => {
    it("should get product by id", async () => {
      const req = {
        params: {
          id: 3,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const mockData = await Product.findOne({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        include: [
          {
            model: Category,
          },
          {
            model: ProductImage,
          },
        ],
      });
      await productController.getProductById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully fetched",
        data: mockData,
      });
    });
    it("should return 404 if product not found", async () => {
      const req = {
        params: {
          id: 111,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.getProductById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-010",
            message: `Id ${req.params.id} not found`,
          },
        ],
      });
    });
    it("should return 400 if id is not a number", async () => {
      const req = {
        params: {
          id: "a",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.getProductById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
  });
  describe("getListProductUser", () => {
    it("should return 200 and get all products of user", async () => {
      const req = {
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const mockData = await Product.findAll({
        where: {
          userId: req.user.id,
          deletedAt: null,
        },
        include: [
          {
            model: Category,
          },
          {
            model: ProductImage,
          },
        ],
      });
      await productController.getListProductUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully fetched",
        data: mockData,
      });
    });
    it("should return 204 if the user doesn't have products", async () => {
      const req = {
        user: {
          id: 3,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis(),
      };
      await productController.getListProductUser(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
    it("should return 400 if there's an error", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.getListProductUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
  });
  describe("createProduct", () => {
    it("should return 201 and create product", async () => {
      const data = fs.readFileSync("./public/60e6901a4992e.jpg");
      const req = {
        user: {
          id: 1,
        },
        body: {
          nama: "Gamepad",
          harga: 10000,
          deskripsi: "Ini gamepad mahal",
          idCategory: 1,
        },
        files: {
          product_images: [
            {
              fieldname: "product_images",
              originalname: "60e6901a4992e.jpg",
              encoding: "7bit",
              mimetype: "image/jpeg",
              buffer: data,
              size: 30286,
            },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product created",
        data: expect.any(Object),
      });
    });
    it("should return 404 if category id not found", async () => {
      const req = {
        user: {
          id: 1,
        },
        body: {
          nama: "Gamepad",
          harga: 10000,
          deskripsi: "Ini gamepad mahal",
          idCategory: 100,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-010",
            message: `Id ${req.body.idCategory} not found`,
          },
        ],
      });
    });
    it("should return 400 if there's an error", async () => {
      const req = {
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
  });
  describe("handleUpdateProduct", () => {
    it("should return 400 if the user don't have product", async () => {
      const req = {
        params: {
          id: 10,
        },
        body: {
          nama: "TV",
          harga: 3000000,
          deskripsi: "Ini tv mahal",
          idCategory: 1,
        },
        user: {
          id: 3,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.handleUpdateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-018",
            message: "You don't have any product",
          },
        ],
      });
    });
    it("should return 400 if there's an error", async () => {
      const req = {
        params: {
          id: 10,
        },
        body: {
          nama: "TV",
          harga: 3000000,
          deskripsi: "Ini tv mahal",
          idCategory: 1,
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.handleUpdateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 404 if the id not found", async () => {
      const req = {
        params: {
          id: 11,
        },
        body: {
          nama: "TV",
          harga: 3000000,
          deskripsi: "Ini tv mahal",
          idCategory: 1,
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.handleUpdateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-010",
            message: `Id ${req.params.id} not found`,
          },
        ],
      });
    });
    it("should return 200 and update product without images", async () => {
      const req = {
        params: {
          id: 10,
        },
        body: {
          nama: "TV",
          harga: 3000000,
          deskripsi: "Ini tv mahal",
        },
        user: {
          id: 1,
        },
        files: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.handleUpdateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully updated",
      });
    });
    it("should return 200 and update product with images", async () => {
      const data = fs.readFileSync("./public/60e6901a4992e.jpg");
      const req = {
        params: {
          id: 1,
        },
        body: {
          nama: "TV",
          harga: 3000000,
          deskripsi: "Ini tv mahal",
        },
        user: {
          id: 1,
        },
        files: {
          product_images: [
            {
              fieldname: "product_images",
              originalname: "60e6901a4992e.jpg",
              encoding: "7bit",
              mimetype: "image/jpeg",
              buffer: data,
              size: 30286,
            },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.handleUpdateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully updated",
      });
    });
  });
  describe("handleDeleteProduct", () => {
    it("should return 200 and delete product", async () => {
      const req = {
        params: {
          id: 10,
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.handleDeleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully deleted",
      });
    });
    it("should return 400 if user doesn't have products", async () => {
      const req = {
        params: {
          id: 10,
        },
        user: {
          id: 3,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.handleDeleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-018",
            message: "You don't have any product",
          },
        ],
      });
    });
    it("should return 400 if user doesn't have products", async () => {
      const req = {
        params: {
          id: 10,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.handleDeleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 404 if the id is not found", async () => {
      const req = {
        params: {
          id: 100,
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await productController.handleDeleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-010",
            message: `Id ${req.params.id} not found`,
          },
        ],
      });
    });
  });
});
