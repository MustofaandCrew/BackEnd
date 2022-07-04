const request = require("supertest");
const app = require("../app");
const { History } = require("../app/models");

afterAll(async () => {
  await History.destroy({
    where: {
      userId: 3,
      productId: 2,
    },
  });
  await History.update(
    {
      status: "Menunggu Konfirmasi",
    },
    {
      where: {
        id: 1,
      },
    }
  );
});

// User
describe("/GET /profile", () => {
  it("should return 200 OK", async () => {
    return request(app)
      .get("/profile")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully get user");
        expect(res.body.data).toBeDefined();
      });
  });
  it("should return 401 if there's no token", async () => {
    return request(app)
      .get("/profile")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .get("/profile")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
});
describe("/PUT /profile", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .put("/profile")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .put("/profile")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if body is not valid", async () => {
    return request(app)
      .put("/profile")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({})
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if email is already registered", async () => {
    return request(app)
      .put("/profile")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        email: "bayu@gmail.com",
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 OK if body is valid", async () => {
    return request(app)
      .put("/profile")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        email: "adrian@gmail.com",
        nama: "Adrian",
        password: "123456",
        kota: "Depok",
        alamat: "Depok City",
        noHp: "081357950711",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully updated");
      });
  });
});

// Buyer
describe("/GET /notifikasiBuyer", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .get("/notifikasiBuyer")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .get("/notifikasiBuyer")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 if there's notification", async () => {
    return request(app)
      .get("/notifikasiBuyer")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjU1NzQyMzY4fQ.lyNQrvZ7JpZaS5HvO3cFUf6fmGO7xBHYl0ePE1usqfg")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully get notifikasi");
        expect(res.body.data).toBeDefined();
      });
  });
  it("should return 204 if there's no notification", async () => {
    return request(app)
      .get("/notifikasiBuyer")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });
});
describe("/GET /historyBuyer", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .get("/historyBuyer")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .get("/historyBuyer")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 if there's history", async () => {
    return request(app)
      .get("/historyBuyer")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjU1NzQyMzY4fQ.lyNQrvZ7JpZaS5HvO3cFUf6fmGO7xBHYl0ePE1usqfg")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully get histories");
        expect(res.body.data).toBeDefined();
      });
  });
  it("should return 204 if there's no history", async () => {
    return request(app)
      .get("/historyBuyer")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });
});
describe("/POST /bid", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .post("/bid")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .post("/bid")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if body invalid", async () => {
    return request(app)
      .post("/bid")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjU1ODExNDk1fQ.D91jt8PB9WTYcmU2Mm6rC_5t_J1xCoqboxJHEudlw6k")
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 400 if bid own product", async () => {
    return request(app)
      .post("/bid")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        productId: 1,
        harga: 100000,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 if bid success", async () => {
    return request(app)
      .post("/bid")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjU1ODExNDk1fQ.D91jt8PB9WTYcmU2Mm6rC_5t_J1xCoqboxJHEudlw6k")
      .send({
        productId: 2,
        harga: 1000000,
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully bid");
      });
  });
});

// Seller
describe("/GET /notifikasiSeller", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .get("/notifikasiSeller")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .get("/notifikasiSeller")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 if there's notification", async () => {
    return request(app)
      .get("/notifikasiSeller")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully get notifikasi");
        expect(res.body.data).toBeDefined();
      });
  });
  it("should return 204 if there's no notification", async () => {
    return request(app)
      .get("/notifikasiSeller")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjU1NzQyMzY4fQ.lyNQrvZ7JpZaS5HvO3cFUf6fmGO7xBHYl0ePE1usqfg")
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });
});
describe("/GET /historySeller", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .get("/historySeller")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .get("/historySeller")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 if there's history", async () => {
    return request(app)
      .get("/historySeller")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully get histories");
        expect(res.body.data).toBeDefined();
      });
  });
  it("should return 204 if there's no history", async () => {
    return request(app)
      .get("/historySeller")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjU2MDM3OTc4fQ.7m84jUk8rYBu-03MOKCeEuqLJcLNZWoFbZ4CxD38vKE")
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });
});
describe("/PUT /updateOrder/:id", () => {
  it("should return 401 if there's no token", async () => {
    return request(app)
      .put("/updateOrder/1")
      .set("Content-type", "application/json")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 401 if token invalid", async () => {
    return request(app)
      .put("/updateOrder/1")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should 400 if body is invalid", async () => {
    return request(app)
      .put("/updateOrder/1")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should 404 if body is invalid", async () => {
    return request(app)
      .put("/updateOrder/100")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        status: "Diterima",
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.errors).toBeDefined();
      });
  });
  it("should return 200 if order is updated", async () => {
    return request(app)
      .put("/updateOrder/1")
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDAwMTc2fQ.BrHyL3qdt1YmymSq5akBLc94CUaqRrqFe0ce4w3_ESA")
      .send({
        status: "Diterima",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully updated");
      });
  });
});
