const express = require("express");
const uploadOnMemory = require("../middleware/multer");
const router = express.Router();
const { authenticationController, userController, categoryController, productController } = require("./controller");
const multipleUpload = uploadOnMemory.fields([{ name: "product_images", maxCount: 4 }]);
const validate = require("./validation/validate");
const bodyValidation = require("./validation/bodyValidation");

router.get("/", (req, res) => {
  res.send({
    message: "Server is running",
  });
});

// Authentication
router.post("/register", bodyValidation.namaValidate, bodyValidation.authValidate, validate.validate, authenticationController.handleRegister);
router.post("/login", bodyValidation.authValidate, validate.validate, authenticationController.handleLogin);

// User
router.get("/profile", authenticationController.authorize, userController.handleGetUser);
router.put(
  "/profile",
  authenticationController.authorize,
  uploadOnMemory.single("picture"),
  bodyValidation.namaValidate,
  bodyValidation.authValidate,
  bodyValidation.userMobilePhoneValidate,
  validate.validate,
  userController.handleUpdate
);

// Buyer
router.post("/bid", authenticationController.authorize, userController.handleBid);
router.get("/notifikasiBuyer", authenticationController.authorize, userController.handleNotifikasiBuyer);
router.get("/historyBuyer", authenticationController.authorize, userController.handleGetHistoryBuyer);

// Seller
router.get("/notifikasiSeller", authenticationController.authorize, userController.handleNotifikasiSeller);
router.put("/updateOrder/:id", authenticationController.authorize, userController.handleUpdateNotifikasi);
router.get("/historySeller", authenticationController.authorize, userController.handleGetHistorySeller);

//Kategori
router.get("/categories", categoryController.getListCategories);
router.get("/categories/:id", categoryController.getListCategoriesById);
router.post("/categories/", bodyValidation.namaValidate, validate.validate, categoryController.createCategory);
router.put("/categories/:id", bodyValidation.namaValidate, validate.validate, categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

//Product
router.post("/products", authenticationController.authorize, multipleUpload, bodyValidation.namaValidate, bodyValidation.productValidate, validate.validate, productController.createProduct);
router.get("/products", productController.getListProducts);
router.get("/myProducts", authenticationController.authorize, productController.getListProductUser);
router.delete("/product/:id", authenticationController.authorize, productController.handleDeleteProduct);
module.exports = router;
