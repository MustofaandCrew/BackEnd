const request = require("supertest");
const app = require("../app");
const { Product } = require("../app/models");

beforeAll(async () => {
  await Product.update(
    {
      deletedAt: null,
    },
    {
      where: {
        id: 29,
      },
    }
  );
});

describe("/GET /products", () => {
  it("should return 200 OK and all products", async () => {
    return request(app)
      .get("/products")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully fetched");
        expect(res.body.data).toBeDefined();
      });
  });
});
describe("/GET /myProducts", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .get("/myProducts")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .get("/myProducts")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 OK and all products", async () => {
    return request(app)
      .get("/myProducts")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully fetched");
        expect(res.body.data).toBeDefined();
      });
  });
  it("should return 204 No Content if there's no product", async () => {
    return request(app)
      .get("/myProducts")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjU1ODExNDk1fQ.D91jt8PB9WTYcmU2Mm6rC_5t_J1xCoqboxJHEudlw6k")
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });
});
describe("/GET /product/:id", () => {
  it("should return 404 Not Found if product not found", async () => {
    return request(app)
      .get("/product/1123")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 OK and product", async () => {
    return request(app)
      .get("/product/1")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully fetched");
        expect(res.body.data).toBeDefined();
      });
  });
});
describe("/POST /products", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .post("/products")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .post("/products")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if the body invalid", async () => {
    return request(app)
      .post("/products")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  // 201 test disabled because it will keep creating new products
  //   it("should return 201 Created if the body valid", async () => {
  //     return request(app)
  //       .post("/products")
  //       .field("nama", "XBOX Controller")
  //       .field("harga", 299000)
  //       .field("deskripsi", "Controller gaming")
  //       .field("idCategory", 1)
  //       .set("Content-type", "multipart/form-data")
  //       .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
  //       .then((res) => {
  //         expect(res.status).toBe(201);
  //         expect(res.body.message).toBe("Product created");
  //         expect(res.body.data).toBeDefined();
  //       });
  //   });
});
describe("/PUT /product/:id", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .put("/product/1")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .put("/product/1")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if the body invalid", async () => {
    return request(app)
      .put("/product/1")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 404 not found", async () => {
    return request(app)
      .put("/product/1123")
      .field("nama", "XBOX Controller")
      .field("harga", 299000)
      .field("deskripsi", "Controller gaming")
      .set("Content-type", "multipart/form-data")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 if the body valid", async () => {
    return request(app)
      .put("/product/29")
      .field("nama", "Fantech Controller")
      .field("harga", 299000)
      .field("deskripsi", "Controller gaming")
      .set("Content-type", "multipart/form-data")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully updated");
      });
  });
});
describe("/DELETE /product/:id", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .delete("/product/1")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .delete("/product/1")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 404 not found", async () => {
    return request(app)
      .delete("/product/1123")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 if the body valid", async () => {
    return request(app)
      .delete("/product/29")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully deleted");
      });
  });
});
