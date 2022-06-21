const { body } = require("express-validator");

module.exports = {
  namaValidate: [
    body("nama").notEmpty().withMessage({
      code: "E-001",
      message: "Nama tidak boleh kosong",
    }),
  ],
  authValidate: [
    body("email").notEmpty().withMessage({
      code: "E-002",
      message: "Email tidak boleh kosong",
    }),
    body("email").isEmail().withMessage({
      code: "E-003",
      message: "Email tidak valid",
    }),
    body("password").notEmpty().withMessage({
      code: "E-004",
      message: "Password tidak boleh kosong",
    }),
  ],
  userMobilePhoneValidate: [
    body("noHp").isMobilePhone("id-ID").withMessage({
      code: "E-005",
      message: "No HP tidak valid",
    }),
  ],
  productValidate: [
    body("harga").notEmpty().withMessage({
      code: "E-006",
      message: "Harga tidak boleh kosong",
    }),
    body("deskripsi").notEmpty().withMessage({
      code: "E-007",
      message: "Deskripsi tidak boleh kosong",
    }),
    body("idCategory").notEmpty().withMessage({
      code: "E-008",
      message: "Id Category tidak boleh kosong",
    }),
  ],
  productUpdateValidate: [
    body("harga").notEmpty().withMessage({
      code: "E-006",
      message: "Harga tidak boleh kosong",
    }),
    body("deskripsi").notEmpty().withMessage({
      code: "E-007",
      message: "Deskripsi tidak boleh kosong",
    }),
  ],
  bidValidate: [
    body("harga").notEmpty().withMessage({
      code: "E-006",
      message: "Harga tidak boleh kosong",
    }),
    body("productId").notEmpty().withMessage({
      code: "E-0016",
      message: "Harga tidak boleh kosong",
    }),
  ],
  orderUpdateValidate: [
    body("status").notEmpty().withMessage({
      code: "E-017",
      message: "Status tidak boleh kosong",
    }),
  ],
};
