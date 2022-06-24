const userController = require("./userController");
const { User, History, Product, ProductImage } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");

beforeAll(async () => {
  await User.create({
    id: 6,
    email: "iqbal@gmail.com",
    password: "123456",
    nama: "Adrian",
    kota: "Jakarta",
    alamat: "Jalan Raya",
    noHp: "081234567890",
  });
  await History.create({
    id: 18,
    userId: 3,
    productId: 4,
    harga: 10000,
    status: "Menunggu Konfirmasi",
    tanggal: new Date(),
  });
});

afterAll(async () => {
  await History.destroy({
    where: {
      [Op.or]: [{ id: 18 }, { userId: 4 }],
    },
  });
  await User.destroy({
    where: {
      email: "iqbalar@gmail.com",
    },
  });
});

describe("userController", () => {
  describe("handleGetUser", () => {
    it("should return 401 if no token is provided", async () => {
      const req = {
        headers: {
          authorization: null,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleGetUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 200 if token is valid", async () => {
      const req = {
        user: {
          id: 1,
        },
      };
      const mockUser = await User.findOne({
        where: {
          id: 1,
        },
      });
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleGetUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: mockUser,
      });
    });
  });
  describe("handleUpdate", () => {
    it("should return 401 if no token is provided", async () => {
      const req = {
        headers: {
          authorization: null,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleUpdate(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 400 if the email is already taken", async () => {
      const req = {
        user: {
          id: 1,
        },
        body: {
          email: "bayu@gmail.com",
          password: "123456",
          nama: "Bayu",
          kota: "Jakarta",
          alamat: "Jalan Raya",
          noHp: "081234567890",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdate(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: "Email already registered",
          },
        ],
      });
    });
    it("should return 404 if the id is not found", async () => {
      const req = {
        user: {
          id: 100,
        },
        body: {
          email: "iqbalar@gmail.com",
          password: "123456",
          nama: "Bayu",
          kota: "Jakarta",
          alamat: "Jalan Raya",
          noHp: "081234567890",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdate(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: `Id ${req.user.id} not found`,
          },
        ],
      });
    });
    it("should return 200 if the user is updated", async () => {
      const req = {
        user: {
          id: 6,
        },
        body: {
          email: "iqbalar@gmail.com",
          password: "123456",
          nama: "Bayu",
          kota: "Jakarta",
          alamat: "Jalan Raya",
          noHp: "081234567890",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleUpdate(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 200 if the user is updated with image", async () => {
      const data = fs.readFileSync("./public/60e6901a4992e.jpg");
      console.log(data, "Ini gambar yang dibaca");
      const req = {
        user: {
          id: 6,
        },
        body: {
          email: "iqbalar@gmail.com",
          password: "123456",
          nama: "Bayu",
          kota: "Jakarta",
          alamat: "Jalan Raya",
          noHp: "081234567890",
        },
        file: {
          fieldname: "picture",
          originalname: "60e6901a4992e.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          buffer: data,
          size: 30286,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleUpdate(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully updated",
      });
    });
    it("should return 200 if the user is updated with the same password", async () => {
      const req = {
        user: {
          id: 2,
        },
        body: {
          email: "bayu@gmail.com",
          password: "123456",
          nama: "Bayu",
          kota: "Surabaya",
          alamat: "Polowijen Raya",
          noHp: "081234567890",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleUpdate(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
  });
  describe("handleBid", () => {
    it("should return 401 if no token is provided", async () => {
      const req = {
        headers: {
          authorization: null,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleBid(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 404 if the productId is not found", async () => {
      const req = {
        user: {
          id: 1,
        },
        body: {
          productId: 100,
          bid: 100000,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleBid(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: `Id ${req.body.productId} not found`,
          },
        ],
      });
    });
    it("should return 400 if the productId is not found", async () => {
      const req = {
        user: {
          id: 1,
        },
        body: {
          productId: 1,
          bid: 100000,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleBid(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: "You can't bid your own product",
          },
        ],
      });
    });
    it("should return 200 if the bid is successfully added", async () => {
      const req = {
        user: {
          id: 4,
        },
        body: {
          productId: 4,
          harga: 100000,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleBid(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
  });
  describe("handleNotifikasiBuyer", () => {
    it("should return 401 if no token is provided", async () => {
      const req = {
        headers: {
          authorization: null,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleNotifikasiBuyer(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 204 if there's no notification", async () => {
      const req = {
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis(),
      };
      await userController.handleNotifikasiBuyer(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
    it("should return 200 if there's notification", async () => {
      const req = {
        user: {
          id: 2,
        },
      };
      const notifikasi = await History.findAll({
        where: {
          userId: req.user.id,
          status: {
            [Op.or]: ["Diterima", "Ditolak"],
          },
        },
        include: [
          {
            model: Product,
            include: [
              {
                model: ProductImage,
              },
            ],
          },
        ],
      });
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleNotifikasiBuyer(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: notifikasi,
      });
    });
  });
  describe("handleNotifikasiSeller", () => {
    it("should return 401 if no token is provided", async () => {
      const req = {
        headers: {
          authorization: null,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleNotifikasiSeller(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 204 if there's no notification", async () => {
      const req = {
        user: {
          id: 2,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis(),
      };
      await userController.handleNotifikasiSeller(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
    it("should return 204 if there's no products", async () => {
      const req = {
        user: {
          id: 5,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis(),
      };
      await userController.handleNotifikasiSeller(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
    it("should return 200 if there's notification", async () => {
      const req = {
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleNotifikasiSeller(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: expect.any(Array),
      });
    });
  });
  describe("handleUpdateNotifikasi", () => {
    it("should return 401 if no token is provided", async () => {
      const req = {
        headers: {
          authorization: null,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleUpdateNotifikasi(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 404 if there's no history to be update", async () => {
      const req = {
        params: {
          id: 100,
        },
        body: {
          status: "Diterima",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleUpdateNotifikasi(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: expect.any(String),
          },
        ],
      });
    });
    it("should return 200 if successfully updated with `Diterima`", async () => {
      const req = {
        params: {
          id: 18,
        },
        body: {
          status: "Diterima",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleUpdateNotifikasi(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 200 if successfully updated with `Ditolak`", async () => {
      const req = {
        params: {
          id: 18,
        },
        body: {
          status: "Ditolak",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleUpdateNotifikasi(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
  });
  describe("handleHistorySeller", () => {
    it("should return 401 if no token is provided", async () => {
      const req = {
        headers: {
          authorization: null,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleGetHistorySeller(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 204 if there's no products owned", async () => {
      const req = {
        user: {
          id: 3,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis(),
      };
      await userController.handleGetHistorySeller(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
    it("should return 204 if there's products owned but none of them bidded yet", async () => {
      const req = {
        user: {
          id: 2,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis(),
      };
      await userController.handleGetHistorySeller(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
    it("should return 200 if there's products owned", async () => {
      const req = {
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleGetHistorySeller(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: expect.any(Array),
      });
    });
  });
  describe("handleHistoryBuyer", () => {
    it("should return 401 if no token is provided", async () => {
      const req = {
        headers: {
          authorization: null,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleGetHistoryBuyer(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 204 if there's no history", async () => {
      const req = {
        user: {
          id: 1,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnThis(),
      };
      await userController.handleGetHistoryBuyer(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
    it("should return 200 if there's history", async () => {
      const req = {
        user: {
          id: 2,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await userController.handleGetHistoryBuyer(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: expect.any(Array),
      });
    });
  });
});
