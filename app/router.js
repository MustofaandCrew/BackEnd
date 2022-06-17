const express = require("express");
const router = express.Router();
const {categoryController} = require("./controller");
const {productController} = require("./controller");

router.get("/", (req, res) => {
  res.send({
    message: "Server is running",
  });
});

//Kategori
router.get('/categories', categoryController.getListCategories);
router.get('/categories/:id', categoryController.getListCategoriesById);
router.post('/categories/create', categoryController.createCategory);
router.put('/categories/update/:id', categoryController.updateCategory);
router.delete('/categories/delete/:id', categoryController.deleteCategory);

// Product
router.get('/products', productController.getListProducts);
router.get('/products/:id', productController.getListProductsById);
router.post('/products/create', productController.createProduct);
router.put('/products/update/:id', productController.updateProduct);
router.delete('/products/delete/:id', productController.deleteProduct);

module.exports = router;
