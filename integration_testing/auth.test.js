const request = require("supertest");
const app = require("../app");
const { User } = require("../app/models");

afterAll(async () => {
  await User.destroy({
    where: {
      email: "adit@gmail.com",
    },
  });
});

describe("/POST /login", () => {
  it("should return 200 and a token", async () => {
    return request(app)
      .post("/login")
      .send({
        email: "adrian@gmail.com",
        password: "123456",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
      });
  });
  it("should return 400 if there's no body", async () => {
    return request(app)
      .post("/login")
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if email invalid", async () => {
    return request(app)
      .post("/login")
      .send({
        email: "asdjhasd.com",
        password: "123456",
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 404 if email not registered", async () => {
    return request(app)
      .post("/login")
      .send({
        email: "hafid@gmail.com",
        password: "123456",
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if password is wrong", async () => {
    return request(app)
      .post("/login")
      .send({
        email: "adrian@gmail.com",
        password: "1234567",
      })
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
});

describe("/POST /register", () => {
  it("should return 400 if the email is already registered", async () => {
    return request(app)
      .post("/register")
      .send({
        nama: "Adrian",
        email: "adrian@gmail.com",
        password: "123456",
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if there's no body send", async () => {
    return request(app)
      .post("/register")
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if email is invalid", async () => {
    return request(app)
      .post("/register")
      .send({
        nama: "Adrian",
        email: "balbal.com",
        password: "123456",
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 OK", async () => {
    return request(app)
      .post("/register")
      .send({
        nama: "Adrian",
        email: "adit@gmail.com",
        password: "123456",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBeDefined();
      });
  });
});
