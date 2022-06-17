const express = require("express");
const uploadOnMemory = require("../middleware/multer");
const router = express.Router();
const { authenticationController, userController, categoryController, productController } = require("./controller");
const multipleUpload = uploadOnMemory.fields([{ name: "product_images", maxCount: 4 }]);

router.get("/", (req, res) => {
  res.send({
    message: "Server is running",
  });
});

router.post("/register", authenticationController.handleRegister);
router.post("/login", authenticationController.handleLogin);
router.get("/profile", authenticationController.authorize, userController.handleGetUser);
router.put("/profile", authenticationController.authorize, uploadOnMemory.single("picture"), userController.handleUpdate);

//Kategori
router.get("/categories", categoryController.getListCategories);
router.get("/categories/:id", categoryController.getListCategoriesById);
router.post("/categories/", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

//Product
router.post("/product/create", authenticationController.authorize, multipleUpload, productController.createProduct);
router.get("/product", authenticationController.authorize, productController.getListProduct);
module.exports = router;
