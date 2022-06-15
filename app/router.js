const express = require("express");
const uploadOnMemory = require("../middleware/multer");
const router = express.Router();
const { authenticationController, userController, categoryController } = require("./controller");

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
router.post("/categories/create", categoryController.createCategory);
router.put("/categories/update/:id", categoryController.updateCategory);
router.delete("/categories/delete/:id", categoryController.deleteCategory);

module.exports = router;
