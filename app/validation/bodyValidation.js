const { body } = require("express-validator");

module.exports = {
  namaValidate: [
    body("nama").notEmpty().withMessage({
      code: "E-001",
      message: "Nama can't be empty",
    }),
  ],
  authValidate: [
    body("email").notEmpty().withMessage({
      code: "E-002",
      message: "Email can't be empty",
    }),
    body("email").isEmail().withMessage({
      code: "E-003",
      message: "Email invalid",
    }),
    body("password").notEmpty().withMessage({
      code: "E-004",
      message: "Password can't be empty",
    }),
  ],
  userMobilePhoneValidate: [
    body("noHp").isMobilePhone("id-ID").withMessage({
      code: "E-005",
      message: "No HP not valid",
    }),
  ],
  productValidate: [
    body("harga").notEmpty().withMessage({
      code: "E-006",
      message: "Harga can't be empty",
    }),
    body("deskripsi").notEmpty().withMessage({
      code: "E-007",
      message: "Deskripsi can't be empty",
    }),
    body("idCategory").notEmpty().withMessage({
      code: "E-008",
      message: "Id Category can't be empty",
    }),
  ],
  productUpdateValidate: [
    body("harga").notEmpty().withMessage({
      code: "E-006",
      message: "Harga can't be empty",
    }),
    body("deskripsi").notEmpty().withMessage({
      code: "E-007",
      message: "Deskripsi can't be empty",
    }),
  ],
  bidValidate: [
    body("harga").notEmpty().withMessage({
      code: "E-006",
      message: "Harga can't be empty",
    }),
    body("productId").notEmpty().withMessage({
      code: "E-0016",
      message: "Product Id can't be empty",
    }),
  ],
  orderUpdateValidate: [
    body("status").notEmpty().withMessage({
      code: "E-017",
      message: "Status can't be empty",
    }),
  ],
};
