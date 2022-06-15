const express = require("express");
const uploadOnMemory = require("../middleware/multer");
const router = express.Router();
const { authenticationController, userController } = require("./controller");

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
router.get("/categories", category.getListCategories);
router.get("/categories/:id", category.getListCategoriesById);
router.post("/categories/add", category.createCategory);
router.put("/categories/edit/:id", category.updateCategory);
router.delete("/categories/delete/:id", category.deleteCategory);

module.exports = router;
