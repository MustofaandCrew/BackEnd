const request = require("supertest");
const app = require("../app");
const { Category } = require("../app/models");

beforeAll(async () => {
  await Category.create({
    id: 3,
    nama: "Peralatan Rumah",
  });
});
afterAll(async () => {
  await Category.destroy({
    where: {
      nama: "Otomotif",
    },
  });
});

//Category get
describe("/GET /categories", () => {
  it("should return all categories 200 OK", async () => {
    return request(app)
      .get("/categories")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Categories fetched successfully");
        expect(res.body.data).toBeDefined();
      });
  });
});

//Category get by id
describe("/GET /categories/:id", () => {
  it("should return a category 200 OK", async () => {
    return request(app)
      .get("/categories/1")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Category By Id fetched successfully");
        expect(res.body.data).toBeDefined();
      });
  });
  it("should return 404 not found", async () => {
    return request(app)
      .get("/categories/325")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
      });
  });
});

//Category post
describe("/POST /categories", () => {
  it("should return a category 201", async () => {
    return request(app)
      .post("/categories")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        nama: "Otomotif",
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Category created successfully");
        expect(res.body.data).toBeDefined();
      });
  });
  it("should return 400 bad request", async () => {
    return request(app)
      .post("/categories")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if category already exist", async () => {
    return request(app)
      .post("/categories")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        nama: "Elektronik",
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if there's no token", async () => {
    return request(app)
      .post("/categories")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .post("/categories")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
});

describe("/PUT /categories/:id", () => {
  it("should return a category 200 OK", async () => {
    return request(app)
      .put("/categories/3")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        nama: "Peralatan Rumah Tangga",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Category updated successfully");
      });
  });
  it("should return 404 not found", async () => {
    return request(app)
      .put("/categories/325")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        nama: "Peralatan Rumah Tangga",
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 bad request", async () => {
    return request(app)
      .put("/categories/3")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 bad request", async () => {
    return request(app)
      .put("/categories/3")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        nama: "Elektronik",
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if there's no token", async () => {
    return request(app)
      .post("/categories")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .post("/categories")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
});

describe("/DELETE /categories/:id", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .delete("/categories/3")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .delete("/categories/3")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return a category 200 OK", async () => {
    return request(app)
      .delete("/categories/3")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNjU2NDY2NDM1fQ.0eP31AZz5HugRG5iPDxcnIJaK--J3AzhXX81axTl-QU")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Category deleted successfully");
      });
  });
  it("should return 404 not found", async () => {
    return request(app)
      .delete("/categories/325")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNjU2NDY2NDM1fQ.0eP31AZz5HugRG5iPDxcnIJaK--J3AzhXX81axTl-QU")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
      });
  });
});
