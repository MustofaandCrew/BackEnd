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
      code: "E-001",
      message: "Email tidak boleh kosong",
    }),
    body("email").isEmail().withMessage({
      code: "E-002",
      message: "Email tidak valid",
    }),
    body("password").notEmpty().withMessage({
      code: "E-001",
      message: "Password tidak boleh kosong",
    }),
  ],
  userMobilePhoneValidate: [
    body("noHp").isMobilePhone("id-ID").withMessage({
      code: "E-003",
      message: "No HP tidak valid",
    }),
  ],
  productValidate: [
    body("harga").notEmpty().withMessage({
      code: "E-001",
      message: "Harga tidak boleh kosong",
    }),
    body("deskripsi").notEmpty().withMessage({
      code: "E-001",
      message: "Deskripsi tidak boleh kosong",
    }),
    body("idCategory").notEmpty().withMessage({
      code: "E-001",
      message: "Id Category tidak boleh kosong",
    }),
  ],
};
