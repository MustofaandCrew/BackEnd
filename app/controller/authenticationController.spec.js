const authenticationController = require("./authenticationController");
const { User } = require("../models");

afterAll(async () => {
  await User.destroy({
    where: {
      email: "iqbal@gmail.com",
    },
  });
});

describe("authenticationController", () => {
  describe("authorize", () => {
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
      const next = jest.fn();
      await authenticationController.authorize(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: "No token provided",
          },
        ],
      });
    });
    it("should return 401 if token is invalid", async () => {
      const req = {
        headers: {
          authorization: "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU1NzQyMTgyfQ.kLMkhOuKxKJCs6zjSsGOAG0V_GGBXmMcCuZCzqE4dzM",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      await authenticationController.authorize(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: "Invalid token",
          },
        ],
      });
    });
    it("should call next if token is valid", async () => {
      const req = {
        headers: {
          authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU1NzQyMTgyfQ.kLMkhOuKxKJCs6zjSsGOAG0V_GGBXmMcCuZCzqE4dzM",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      await authenticationController.authorize(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe("handleLogin", () => {
    it("should return 400 if there's an error", async () => {
      const req = {
        body: {
          password: "password",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      await authenticationController.handleLogin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 404 if email is not found", async () => {
      const req = {
        body: {
          email: "sbayu@mail.com",
          password: "password",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: `Email ${req.body.email} not found`,
          },
        ],
      });
    });
    it("should return 401 if password is wrong", async () => {
      const req = {
        body: {
          email: "adrian@gmail.com",
          password: "1234567",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await authenticationController.handleLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: "Wrong password",
          },
        ],
      });
    });
    it("should return 200 if login is successful", async () => {
      const req = {
        body: {
          email: "adrian@gmail.com",
          password: "123456",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await authenticationController.handleLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: expect.any(String),
      });
    });
  });
  describe("handleRegister", () => {
    it("should return 400 if there's an error", async () => {
      const req = {
        body: {
          password: "123456",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleRegister(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
    it("should return 400 if email is already registered", async () => {
      const req = {
        body: {
          email: "adrian@gmail.com",
          password: "123456",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await authenticationController.handleRegister(req, res);
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
    it("should return 200 if registration is successful", async () => {
      const req = {
        body: {
          nama: "Adrian",
          email: "iqbal@gmail.com",
          password: "123456",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await authenticationController.handleRegister(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
      });
    });
  });
});
